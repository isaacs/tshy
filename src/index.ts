#!/usr/bin/env node

import chalk from 'chalk'
import build from './build.js'
import * as debugConsole from './console.js'
import './exports.js'
import pkg from './package.js'
import usage from './usage.js'
import watch from './watch.js'

const { exports: exp, tshy } = pkg

const main = async () => {
  for (const arg of process.argv.slice(2)) {
    switch (arg) {
      case '--help':
      case '-h':
        return usage()
      case '--watch':
      case '-w':
        return watch()
      default:
        return usage(`Unknown argument: ${arg}`)
    }
  }

  debugConsole.debug(chalk.yellow.bold('building'), process.cwd())
  debugConsole.debug(chalk.cyan.dim('tshy config'), tshy)
  debugConsole.debug(chalk.cyan.dim('exports'), exp)

  await build()

  debugConsole.log(chalk.bold.green('success!'))
}
await main()
