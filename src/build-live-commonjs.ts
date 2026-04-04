import chalk from 'chalk'
import { linkSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { relative, resolve } from 'node:path/posix'
import config from './config.js'
import * as console from './console.js'
import ifExist from './if-exist.js'
import polyfills from './polyfills.js'
import setFolderDialect from './set-folder-dialect.js'
import sources from './sources.js'
import './tsconfig.js'

const { commonjsDialects = [] } = config

// don't actually do a build, just link files into places.
export const buildLiveCommonJS = () => {
  for (const d of ['commonjs', ...commonjsDialects]) {
    const pfn = d === 'commonjs' ? 'cjs' : `commonjs-${d}`
    const dist = d === 'commonjs' ? 'commonjs' : `commonjs/${d}`
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
      ).replace(/\.cts$/, '')
      const stemTo = resolve(
        `.tshy-build/${dist}`,
        relative(resolve('src'), resolve(orig)),
      ).replace(/\.tsx?$/, '')
      ifExist.unlink(`${stemTo}.js.map`)
      ifExist.unlink(`${stemTo}.d.ts.map`)
      ifExist.rename(`${stemFrom}.cjs`, `${stemTo}.js`)
      ifExist.rename(`${stemFrom}.d.cts`, `${stemTo}.d.ts`)
    }
    console.error(chalk.cyan.bold('linked commonjs'))
  }
  setFolderDialect('.tshy-build/commonjs', 'commonjs')
}
