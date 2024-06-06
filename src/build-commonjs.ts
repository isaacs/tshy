import chalk from 'chalk'
import { spawnSync } from 'node:child_process'
import { relative, resolve } from 'node:path/posix'
import buildFail from './build-fail.js'
import config from './config.js'
import * as console from './console.js'
import ifExist from './if-exist.js'
import polyfills from './polyfills.js'
import setFolderDialect from './set-folder-dialect.js'
import './tsconfig.js'
import tsc from './which-tsc.js'

const node = process.execPath
const { commonjsDialects = [] } = config

export const buildCommonJS = () => {
  setFolderDialect('src', 'commonjs')
  for (const d of ['commonjs', ...commonjsDialects]) {
    const pf = polyfills.get(d === 'commonjs' ? 'cjs' : d)
    console.debug(chalk.cyan.dim('building ' + d))
    const res = spawnSync(node, [tsc, '-p', `.tshy/${d}.json`], {
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
      ifExist.unlink(stemToPath)
      ifExist.unlink(stemToDtsPath)
      ifExist.rename(`${stemFrom}.cjs`, `${stemTo}.js`)
      ifExist.rename(`${stemFrom}.d.cts`, `${stemTo}.d.ts`)
    }
    console.error(chalk.cyan.bold('built commonjs'))
  }
  setFolderDialect('src')
}
