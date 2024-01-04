import { resolve } from 'path'
import { readFileSync } from 'node:fs'
import fail from './fail.js'
import { TshyConfig } from './types.js'

export default (p: any): p is TshyConfig['project'] => {
  if (typeof p === 'string') {
    try {
      readFileSync(resolve(p), 'utf8')
      return true
    } catch (_) {}
  }

  fail(
    `tshy.project must point to a tsconfig file on disk, ` +
      `got: ${JSON.stringify(p)}`
  )
  return process.exit(1)
}
