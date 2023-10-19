import chalk from 'chalk'
import { writeFileSync } from 'fs'
import { rimrafSync } from 'rimraf'
import * as console from './console.js'
import getImports from './built-imports.js'
import pkg from './package.js'
import { Dialect } from './types.js'

const writeDialectPJ = (d: string, mode?: Dialect) => {
  if (!mode) {
    return rimrafSync(`${d}/package.json`)
  }
  const v: { type: string; imports?: Record<string, any> } = {
    type: mode === 'commonjs' ? 'commonjs' : 'module',
    imports: getImports(pkg),
  }
  writeFileSync(
    `${d}/package.json`,
    JSON.stringify(v, null, 2) + '\n'
  )
}

export default (where: string, mode?: Dialect) => {
  if (mode)
    console.debug(chalk.cyan.dim('set dialect'), { where, mode })
  writeDialectPJ(where, mode)
}
