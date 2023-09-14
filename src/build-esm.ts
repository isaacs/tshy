import chalk from 'chalk'
import { spawnSync } from 'node:child_process'
import buildFail from './build-fail.js'
import * as console from './console.js'
import setFolderDialect from './set-folder-dialect.js'

export const buildESM = () => {
  console.debug(chalk.cyan.dim('building esm'))
  setFolderDialect('src', 'esm')
  const res = spawnSync('tsc -p .tshy/esm.json', {
    shell: true,
    stdio: 'inherit',
  })
  setFolderDialect('src')
  if (res.status || res.signal) buildFail(res)
  setFolderDialect('.tshy-build-tmp/esm', 'esm')
  console.error(chalk.cyan.bold('built esm'))
}
