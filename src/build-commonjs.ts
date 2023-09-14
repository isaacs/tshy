import chalk from 'chalk'
import { spawnSync } from 'node:child_process'
import { renameSync } from 'node:fs'
import { relative, resolve } from 'node:path/posix'
import buildFail from './build-fail.js'
import * as console from './console.js'
import polyfills from './polyfills.js'
import setFolderDialect from './set-folder-dialect.js'
import './tsconfig.js'

export const buildCommonJS = () => {
  console.debug(chalk.cyan.dim('building commonjs'))
  setFolderDialect('src', 'commonjs')
  const res = spawnSync('tsc -p .tshy/commonjs.json', {
    shell: true,
    stdio: 'inherit',
  })
  setFolderDialect('src')
  if (res.status || res.signal) return buildFail(res)
  setFolderDialect('.tshy-build-tmp/commonjs', 'commonjs')
  console.error(chalk.cyan.bold('built commonjs'))
  // apply polyfills
  for (const [f, t] of polyfills.entries()) {
    const stemFrom = resolve(
      '.tshy-build-tmp/commonjs',
      relative(resolve('src'), resolve(f))
    ).replace(/\.cts$/, '')
    const stemTo = resolve(
      '.tshy-build-tmp/commonjs',
      relative(resolve('src'), resolve(t))
    ).replace(/\.tsx?$/, '')
    renameSync(`${stemFrom}.cjs`, `${stemTo}.js`)
    renameSync(`${stemFrom}.d.cts`, `${stemTo}.d.ts`)
  }
}
