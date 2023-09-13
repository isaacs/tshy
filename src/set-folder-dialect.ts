import { writeFileSync } from 'fs'
import { rimrafSync } from 'rimraf'
import { Dialect } from './types.js'
import * as console from './console.js'
import chalk from 'chalk'

const writeDialectPJ = (f: string, mode?: Dialect) =>
  mode
    ? writeFileSync(
        f,
        JSON.stringify({
          type: mode === 'commonjs' ? 'commonjs' : 'module',
        })
      )
    : rimrafSync(f)

export default (where: string, mode?: Dialect) => {
  if (mode) console.debug(chalk.cyan.dim('set dialect'), {where, mode})
  writeDialectPJ(`${where}/package.json`, mode)
}
