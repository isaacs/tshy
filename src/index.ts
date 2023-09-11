#!/usr/bin/env node

import chalk from 'chalk'

import './exports.js'
import pkg from './package.js'

const { exports: exp, tshy } = pkg

console.error(chalk.yellow.bold('building'))
console.error(chalk.cyan.dim('tshy config'), tshy)
console.error(chalk.cyan.dim('exports'), exp)

// have our config, time to build
await import('./build.js')

console.log(chalk.bold.green('success!'))
