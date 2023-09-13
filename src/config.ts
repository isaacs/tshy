// get the config and package and stuff

import { fail } from './fail.js'
import { Dialect, Export, Package, TshyConfig } from './types.js'

const validConfig = (e: any): e is TshyConfig =>
  !!e &&
  typeof e === 'object' &&
  (e.exports === undefined || validExports(e['exports'])) &&
  (e.dialects === undefined || validDialects(e['dialects']))

const isDialect = (d: any): d is Dialect =>
  d === 'commonjs' || d === 'esm'

const validDialects = (
  d: any
): d is Exclude<TshyConfig['dialects'], undefined> =>
  !!d && Array.isArray(d) && !d.some(d => !isDialect(d))

const validExternalExport = (exp: any): exp is Export => {
  const i = resolveExport(exp, 'import')
  const r = resolveExport(exp, 'require')
  if (!i && !r) return false
  if (i && join(i).startsWith('src/')) return false
  if (r && join(r).startsWith('src/')) return false
  return true
}

const validExports = (
  e: any
): e is Exclude<TshyConfig['exports'], undefined> => {
  if (!e) return false
  if (typeof e !== 'object') return false
  for (const [sub, exp] of Object.entries(e)) {
    if (sub !== '.' && !sub.startsWith('./')) {
      fail(
        `tshy.exports key must be "." or start with "./", got: ${sub}`
      )
      process.exit(1)
    }

    // just a module. either a built export, or a simple unbuilt export
    if (typeof exp === 'string') {
      e[sub] = addDot(exp)
      continue
    }

    if (typeof exp !== 'object' || !exp || Array.isArray(exp)) {
      fail(
        `tshy.exports ${sub} value must be string or import/require object, ` +
          `got: ${JSON.stringify(exp)}`
      )
      process.exit(1)
    }

    // can be:
    // "./sub": "./unbuilt.js"
    // "./sub": { require: "./unbuilt.js", types: "./unbuilt.d.ts" }
    // "./sub": {require:"./u.cjs",import:"./u.cjs",types:"./u.dts"}
    // "./sub": {import:{types:"u.d.ts",default:"u.js"},require:{types:"u.d.cts", default:"u.cjs"}}
    // Just verify that import and require resolutions are not in src

    if (!validExternalExport(exp)) {
      fail(
        `tshy.exports ${sub} unbuilt exports must not be in ./src, ` +
          `and exports in src must be string values. ` +
          `got: ${JSON.stringify(exp)}`
      )
      process.exit(1)
    }

    e[sub] = exp
  }
  if (e.dialects) {
    if (!validDialects(e.dialects)) {
      fail(
        `tshy.dialects must be array containing 'esm' and/or 'commonjs', ` +
          `got: ${JSON.stringify(e.dialects)}`
      )
    }
  }
  return true
}

const addDot = (s: string) => `./${join(s)}`

const getConfig = (
  pkg: Package,
  sources: Set<string>
): TshyConfig => {
  const tshy: TshyConfig = validConfig(pkg.tshy) ? pkg.tshy : {}
  if (tshy.exports) return tshy
  const e: Exclude<TshyConfig['exports'], undefined> = {
    './package.json': './package.json',
  }
  for (const i of sources) {
    if (/^\.\/src\/index\.[^\.]+$/.test(i)) {
      e['.'] = i
      break
    }
  }
  pkg.tshy = tshy
  tshy.exports = e
  return tshy
}

import { join } from 'path/posix'
import pkg from './package.js'
import sources from './sources.js'
import { resolveExport } from './resolve-export.js'

const config: TshyConfig = getConfig(pkg, sources)
export default config
