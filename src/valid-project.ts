import { resolve } from 'path'
import { readFileSync } from 'node:fs'
import fail from './fail.js'
import { FailureReasonCallback, TshyConfig } from './types.js'

const noop = () => {}

export const isValidProject = (p: any, onFail: FailureReasonCallback = noop): p is TshyConfig['project'] => {
  if (typeof p === 'string') {
    try {
      readFileSync(resolve(p), 'utf8')
      return true
    } catch (_) {}
  }

  onFail(
    `tshy.project must point to a tsconfig file on disk, ` +
      `got: ${JSON.stringify(p)}`
  )

  return false
}


export default (p: any): p is TshyConfig['project'] => {
  if(!isValidProject(p, fail)) {
    return process.exit(1)
  }
  
  return true
}
