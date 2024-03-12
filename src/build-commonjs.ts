import chalk from 'chalk'
import { spawnSync } from 'node:child_process'
import { existsSync, renameSync, unlinkSync } from 'node:fs'
import { relative, resolve } from 'node:path/posix'
import buildFail from './build-fail.js'
import config from './config.js'
import * as console from './console.js'
import polyfills from './polyfills.js'
import setFolderDialect from './set-folder-dialect.js'
import { generateTsConfigFiles } from './tsconfig.js'
await generateTsConfigFiles()

const { commonjsDialects = [] } = config

const unlinkIfExist = (f: string) => existsSync(f) && unlinkSync(f)
const renameIfExist = (f: string, to: string) =>
  existsSync(f) && renameSync(f, to)

export const buildCommonJS = () => {
  setFolderDialect('src', 'commonjs')
  for (const d of ['commonjs', ...commonjsDialects]) {
    const pf = polyfills.get(d === 'commonjs' ? 'cjs' : d)
    console.debug(chalk.cyan.dim('building ' + d))
    const res = spawnSync(`tsc -p .tshy/${d}.json`, {
      shell: true,
      stdio: 'inherit',
    })
    if (res.status || res.signal) {
      setFolderDialect('src')
      return buildFail(res)
    }
    setFolderDialect('.tshy-build/' + d, 'commonjs')
    for (const [override, orig] of pf?.map.entries() ?? []) {
      const stemFrom = resolve(
        `.tshy-build/${d}`,
        relative(resolve('src'), resolve(override))
      ).replace(/\.cts$/, '')
      const stemTo = resolve(
        `.tshy-build/${d}`,
        relative(resolve('src'), resolve(orig))
      ).replace(/\.tsx?$/, '')
      const stemToPath = `${stemTo}.js.map`
      const stemToDtsPath = `${stemTo}.d.ts.map`
      unlinkIfExist(stemToPath)
      unlinkIfExist(stemToDtsPath)
      renameIfExist(`${stemFrom}.cjs`, `${stemTo}.js`)
      renameIfExist(`${stemFrom}.d.cts`, `${stemTo}.d.ts`)
    }
    console.error(chalk.cyan.bold('built commonjs'))
  }
  setFolderDialect('src')
}
