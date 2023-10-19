// this is the thing that supports top-level package.json imports
// via symlinks, not the tshy.imports which are just config.
import { writeFileSync } from 'fs'
import { symlink } from 'fs/promises'
import { mkdirp } from 'mkdirp'
import { dirname, relative, resolve, sep } from 'path'
import {
  getAllConditionalValues,
  getUniqueConditionSets,
  resolveAllLocalImports,
} from 'resolve-import'
import { rimraf } from 'rimraf'
import { fileURLToPath } from 'url'
import * as console from './console.js'
import { Package } from './types.js'

const dirsMade = new Set<string>()

// write out the steps to the save file script
export const save = (f: string): boolean => {
  const links = [...saveSet.entries()]
  if (!links.length) return false
  const dirs = new Set<string>(links.map(([dest]) => dirname(dest)))
  console.debug('save import linker', f)
  writeFileSync(
    f,
    `import { mkdirSync } from 'node:fs'
import { symlink } from 'node:fs/promises'
const dirs = ${JSON.stringify([...dirs])}
const links = [
${links.map(l => `  ${JSON.stringify(l)},\n`).join('')}]
const e = (er) => { if (er.code !== 'EEXIST') throw er }
for (const d of dirs) mkdirSync(d, { recursive: true })
Promise.all(links.map(([dest, src]) => symlink(src, dest).catch(e)))
`
  )
  return true
}

let targets: undefined | string[] = undefined
// Get the targets that will have to be linked, because they're not
// a target in ./src
const getTargets = async (imports: Record<string, any>) => {
  const conds = getAllConditionalValues(imports).filter(
    c => !c.startsWith('./src/')
  )
  if (!conds.some(c => c.includes('*'))) {
    // fast path
    return (targets = conds.filter(c => c.startsWith('./')))
  }
  const sets = getUniqueConditionSets(imports)
  const t = new Set<string>()
  const pj = resolve('package.json')
  for (const conditions of sets) {
    const imps = await resolveAllLocalImports(pj, { conditions })
    for (const url of Object.values(imps)) {
      // node builtin
      if (typeof url === 'string') continue
      const p = fileURLToPath(url)
      const rel = relative(process.cwd(), p)
      // if it's empty, a dep in node_modules, or a built module, skip
      if (
        !rel ||
        rel.startsWith('..' + sep) ||
        rel.startsWith('src' + sep) ||
        rel.startsWith('node_modules' + sep)
      )
        continue
      t.add('./' + rel.replace(/\\/g, '/'))
    }
  }
  return (targets = [...t])
}

const saveSet = new Map<string, string>()

// create symlinks for the package imports in the target dir
export const link = async (
  pkg: Package,
  dir: string,
  save = false
) => {
  const { imports } = pkg
  if (!imports) return
  if (!targets) targets = await getTargets(imports)
  if (!targets.length) return
  console.debug(`link import targets in ${dir}`, targets)
  const rel = relative(resolve(dir), process.cwd())
  const lps: Promise<any>[] = []
  for (const t of targets) {
    const l = t.replace(/^\.\//, '')
    const df = dirname(l)
    const dfrel =
      df === '.'
        ? ''
        : df
            .split('/')
            .map(() => '../')
            .join('')
    const dest = dir + '/' + l
    const src = rel + '/' + dfrel + l
    if (save) saveSet.set(dest, src)
    lps.push(
      mkdirp(dirname(dest))
        .then(d => {
          // if we aren't saving, then this is a transient link
          // save the dirs created so that we can clean them up
          if (!save && d) dirsMade.add(d)
          return rimraf(dest)
        })
        .then(() => symlink(src, dest))
    )
  }
  await Promise.all(lps)
}

// remove symlinks created for package imports in the target dir
export const unlink = async (pkg: Package, dir: string) => {
  const { imports } = pkg
  if (!imports) return
  // will always have targets by this point
  /* c8 ignore start */
  if (!targets) targets = await getTargets(imports)
  /* c8 ignore stop */
  console.debug(`unlink import targets in ${dir}`, targets)
  const lps: Promise<any>[] = []
  for (const t of targets) {
    const dest = resolve(dir, t)
    lps.push(rimraf(dest))
  }
  for (const d of dirsMade) lps.push(rimraf(d))
  await Promise.all(lps)
}
