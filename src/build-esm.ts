import chalk from 'chalk'
import { spawnSync } from 'node:child_process'
import { relative, resolve } from 'node:path'
import buildFail from './build-fail.js'
import config from './config.js'
import * as console from './console.js'
import ifExist from './if-exist.js'
import polyfills from './polyfills.js'
import setFolderDialect from './set-folder-dialect.js'
import './tsconfig.js'
import tsc from './which-tsc.js'

const node = process.execPath
const { esmDialects = [] } = config

export const buildESM = () => {
  setFolderDialect('src', 'esm')
  for (const d of ['esm', ...esmDialects]) {
    const pf = polyfills.get(d)
    console.debug(chalk.cyan.dim('building ' + d))
    const res = spawnSync(node, [tsc, '-p', `.tshy/${d}.json`], {
      stdio: 'inherit',
    })
    if (res.status || res.signal) {
      setFolderDialect('src')
      return buildFail(res)
    }
    setFolderDialect('.tshy-build/' + d, 'esm')
    for (const [override, orig] of pf?.map.entries() ?? []) {
      const stemFrom = resolve(
        `.tshy-build/${d}`,
        relative(resolve('src'), resolve(override))
      ).replace(/\.mts$/, '')
      const stemTo = resolve(
        `.tshy-build/${d}`,
        relative(resolve('src'), resolve(orig))
      ).replace(/\.tsx?$/, '')
      ifExist.unlink(`${stemTo}.js.map`)
      ifExist.unlink(`${stemTo}.d.ts.map`)
      ifExist.rename(`${stemFrom}.mjs`, `${stemTo}.js`)
      ifExist.rename(`${stemFrom}.d.mts`, `${stemTo}.d.ts`)
    }
    console.error(chalk.cyan.bold('built ' + d))
  }
  setFolderDialect('src')
}
