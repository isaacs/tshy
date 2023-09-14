import chalk from 'chalk'
import { rimrafSync } from 'rimraf'
import { syncContentSync } from 'sync-content'
import bins from './bins.js'
import * as console from './console.js'
import dialects from './dialects.js'
import './tsconfig.js'
import writePackage from './write-package.js'
import { buildESM } from './build-esm.js'
import { buildCommonJS } from './build-commonjs.js'

rimrafSync('.tshy-build-tmp')

if (dialects.includes('esm')) buildESM()
if (dialects.includes('commonjs')) buildCommonJS()

console.debug(chalk.cyan.dim('moving to ./dist'))
syncContentSync('.tshy-build-tmp', 'dist')
console.debug(chalk.cyan.dim('removing build temp dir'))
rimrafSync('.tshy-build-tmp')
console.debug(chalk.cyan.dim('chmod bins'))
bins()
console.debug(chalk.cyan.dim('write package.json'))
writePackage()
