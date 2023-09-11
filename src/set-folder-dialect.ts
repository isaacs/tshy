import { writeFileSync } from 'fs'
import { rimrafSync } from 'rimraf'
import { Dialect } from './types.js'

const writeDialectPJ = (f: string, mode?: Dialect) =>
  mode
    ? writeFileSync(
        f,
        JSON.stringify({
          type: mode === 'commonjs' ? 'commonjs' : 'module',
        })
      )
    : rimrafSync(f)

export default (where: string, mode?: Dialect) =>
  writeDialectPJ(`${where}/package.json`, mode)
