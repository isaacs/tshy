import chalk from 'chalk'
import { linkSync, mkdirSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import config from './config.js'
import * as console from './console.js'
import ifExist from './if-exist.js'
import polyfills from './polyfills.js'
import setFolderDialect from './set-folder-dialect.js'
import sources from './sources.js'
import './tsconfig.js'

const { esmDialects = [] } = config

export const buildLiveESM = () => {
  for (const d of ['esm', ...esmDialects]) {
    const pfn = d === 'esm' ? 'esm' : `esm-${d}`
    const dist = d === 'esm' ? 'esm' : `esm/${d}`
    const pf = polyfills.get(pfn)
    console.debug(chalk.cyan.dim('linking ' + dist))
    for (const s of sources) {
      const source = s.substring('./src/'.length)
      const target = resolve(`.tshy-build/${dist}/${source}`)
      mkdirSync(dirname(target), { recursive: true })
      linkSync(s, target)
    }
    for (const [override, orig] of pf?.map.entries() ?? []) {
      const stemFrom = resolve(
        `.tshy-build/${dist}`,
        relative(resolve('src'), resolve(override)),
      ).replace(/\.mts$/, '')
      const stemTo = resolve(
        `.tshy-build/${dist}`,
        relative(resolve('src'), resolve(orig)),
      ).replace(/\.tsx?$/, '')
      ifExist.unlink(`${stemTo}.js.map`)
      ifExist.unlink(`${stemTo}.d.ts.map`)
      ifExist.rename(`${stemFrom}.mjs`, `${stemTo}.js`)
      ifExist.rename(`${stemFrom}.d.mts`, `${stemTo}.d.ts`)
    }
    console.error(chalk.cyan.bold('linked ' + d))
  }
  setFolderDialect('.tshy-build/esm', 'esm')
}
