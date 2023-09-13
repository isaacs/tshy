#!/usr/bin/env node

import chalk from 'chalk'
import * as console from './console.js'
import './exports.js'
import pkg from './package.js'

const { exports: exp, tshy } = pkg

console.debug(chalk.yellow.bold('building'), process.cwd())
console.debug(chalk.cyan.dim('tshy config'), tshy)
console.debug(chalk.cyan.dim('exports'), exp)

// have our config, time to build
await import('./build.js')

console.log(chalk.bold.green('success!'))
