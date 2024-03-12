import chalk from 'chalk'
import { spawnSync } from 'node:child_process'
import { renameSync, unlinkSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import buildFail from './build-fail.js'
import config from './config.js'
import * as console from './console.js'
import polyfills from './polyfills.js'
import setFolderDialect from './set-folder-dialect.js'
import { generateTsConfigFiles } from './tsconfig.js'

await generateTsConfigFiles()

const { esmDialects = [] } = config

export const buildESM = () => {
  setFolderDialect('src', 'esm')

  for (const d of ['esm', ...esmDialects]) {
    const pf = polyfills.get(d)

    console.debug(chalk.cyan.dim('building ' + d))

    const res = spawnSync(`tsc -p .tshy/${d}.json`, {
      shell: true,
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

      unlinkSync(`${stemTo}.js.map`)
      unlinkSync(`${stemTo}.d.ts.map`)
      renameSync(`${stemFrom}.mjs`, `${stemTo}.js`)
      renameSync(`${stemFrom}.d.mts`, `${stemTo}.d.ts`)
    }

    console.error(chalk.cyan.bold('built ' + d))
  }

  setFolderDialect('src')
}
