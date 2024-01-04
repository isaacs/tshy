import { resolve } from 'path'
import { existsSync } from 'node:fs'
import fail from './fail.js'
import { TshyConfig } from './types.js'

export default (p: any): p is TshyConfig['tsconfigPath'] => {
  if (typeof p === 'string' && existsSync(resolve(p))) {
    return true
  }

  fail(
    `tshy.tsconfigPath must point to a tsconfig file on disk, ` +
      `got: ${JSON.stringify(p)}`
  )
  return process.exit(1)
}
