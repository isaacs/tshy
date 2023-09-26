import fail from './fail.js'
import { Dialect, TshyConfig } from './types.js'

export const isDialect = (d: any): d is Dialect =>
  d === 'commonjs' || d === 'esm'

export default (
  d: any
): d is Exclude<TshyConfig['dialects'], undefined> => {
  if (
    !!d &&
    Array.isArray(d) &&
    d.length &&
    !d.some(d => !isDialect(d))
  ) {
    return true
  }

  fail(
    `tshy.dialects must be an array including "esm" and/or "commonjs", ` +
      `got: ${JSON.stringify(d)}`
  )
  return process.exit(1)
}
