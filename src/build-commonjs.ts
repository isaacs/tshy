import chalk from 'chalk'
import { spawnSync } from 'node:child_process'
import { renameSync, unlinkSync } from 'node:fs'
import { relative, resolve } from 'node:path/posix'
import buildFail from './build-fail.js'
import config from './config.js'
import * as console from './console.js'
import polyfills from './polyfills.js'
import setFolderDialect from './set-folder-dialect.js'
import './tsconfig.js'
const { commonjsDialects = [] } = config

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
    setFolderDialect('.tshy-build-tmp/' + d, 'commonjs')
    for (const [override, orig] of pf?.map.entries() ?? []) {
      const stemFrom = resolve(
        `.tshy-build-tmp/${d}`,
        relative(resolve('src'), resolve(override))
      ).replace(/\.cts$/, '')
      const stemTo = resolve(
        `.tshy-build-tmp/${d}`,
        relative(resolve('src'), resolve(orig))
      ).replace(/\.tsx?$/, '')
      unlinkSync(`${stemTo}.js.map`)
      unlinkSync(`${stemTo}.d.ts.map`)
      renameSync(`${stemFrom}.cjs`, `${stemTo}.js`)
      renameSync(`${stemFrom}.d.cts`, `${stemTo}.d.ts`)
    }
    console.error(chalk.cyan.bold('built commonjs'))
  }
  setFolderDialect('src')
}
