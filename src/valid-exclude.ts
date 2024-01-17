import fail from './fail.js'
import { TshyConfig } from './types.js'
export default (
  d: any
): d is Exclude<TshyConfig['exclude'], undefined> => {
  if (
    !!d &&
    Array.isArray(d) &&
    d.length &&
    !d.some(d => typeof d !== 'string')
  ) {
    return true
  }
  fail(
    `tshy.exclude must be an array of string glob patterns if defined, ` +
      `got: ${JSON.stringify(d)}`
  )
  return process.exit(1)
}
