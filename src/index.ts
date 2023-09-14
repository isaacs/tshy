#!/usr/bin/env node

import chalk from 'chalk'
import * as console from './console.js'
import './exports.js'
import pkg from './package.js'
import build from './build.js'

const { exports: exp, tshy } = pkg

console.debug(chalk.yellow.bold('building'), process.cwd())
console.debug(chalk.cyan.dim('tshy config'), tshy)
console.debug(chalk.cyan.dim('exports'), exp)

build()

console.log(chalk.bold.green('success!'))
