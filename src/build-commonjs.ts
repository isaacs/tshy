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
import { mkdirSync } from 'node:fs'

const node = process.execPath
const { commonjsDialects = [] } = config

export const buildCommonJS = () => {
  setFolderDialect('src', 'commonjs')
  for (const d of ['commonjs', ...commonjsDialects]) {
    const pfn = d === 'commonjs' ? 'cjs' : `commonjs-${d}`
    const pf = polyfills.get(pfn)
    const cfg = d === 'commonjs' ? 'commonjs' : `commonjs-${d}`
    console.debug(chalk.cyan.dim('building ' + cfg), [
      node,
      [tsc, '-p', `.tshy/${cfg}.json`],
      {
        stdio: 'inherit',
      },
    ])
    const res = spawnSync(node, [tsc, '-p', `.tshy/${cfg}.json`], {
      stdio: 'inherit',
    })
    if (res.status || res.signal) {
      setFolderDialect('src')
      return buildFail(res)
    }
    const dist = d === 'commonjs' ? d : `commonjs/${d}`
    mkdirSync(`.tshy-build/${dist}`, { recursive: true })
    for (const [override, orig] of pf?.map.entries() ?? []) {
      const stemFrom = resolve(
        `.tshy-build/${dist}`,
        relative(resolve('src'), resolve(override)),
      ).replace(/\.cts$/, '')
      const stemTo = resolve(
        `.tshy-build/${dist}`,
        relative(resolve('src'), resolve(orig)),
      ).replace(/\.tsx?$/, '')
      const stemToPath = `${stemTo}.js.map`
      const stemToDtsPath = `${stemTo}.d.ts.map`
      ifExist.unlink(stemToPath)
      ifExist.unlink(stemToDtsPath)
      ifExist.rename(`${stemFrom}.cjs`, `${stemTo}.js`)
      ifExist.rename(`${stemFrom}.d.cts`, `${stemTo}.d.ts`)
    }
    setFolderDialect('.tshy-build/commonjs', 'commonjs')
    console.error(chalk.cyan.bold('built ' + dist))
  }
  setFolderDialect('src')
}
