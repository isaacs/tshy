// validate esmDialects and commonjsDialects
import fail from './fail.js'
import { TshyConfig } from './types.js'

const arrayOverlap = (
  a: string[] | undefined,
  b: string[] | undefined
): string | false => {
  if (!a || !b) return false
  for (const av of a) {
    if (b.includes(av)) {
      return av
    }
  }
  return false
}

export const isValidExtraDialectSet = (
  e: string[],
  which: 'commonjs' | 'esm'
) => {
  for (const d of e) {
    if (typeof d !== 'string') {
      fail(`${which} must be an array of strings, got: ${d}`)
      return process.exit(1)
    }
    if (
      d === 'commonjs' ||
      d === 'cjs' ||
      d === 'esm' ||
      d === 'require' ||
      d === 'import' ||
      d === 'node' ||
      d === 'default'
    ) {
      fail(`${which} must not contain ${d}`)
      return process.exit(1)
    }
  }
  return true
}

export const isValidExtraDialectConfig = ({
  commonjsDialects,
  esmDialects,
}: TshyConfig) => {
  if (commonjsDialects === undefined && esmDialects === undefined) {
    return true
  }
  if (
    commonjsDialects &&
    !isValidExtraDialectSet(commonjsDialects, 'commonjs')
  ) {
    return false
  }
  if (esmDialects && !isValidExtraDialectSet(esmDialects, 'esm')) {
    return false
  }
  const overlap = arrayOverlap(commonjsDialects, esmDialects)
  if (overlap) {
    fail(
      'commonjsDialects and esmDialects must be unique, ' +
        `found ${overlap} in both lists`
    )
    return process.exit(1)
  }
  return true
}

export default isValidExtraDialectConfig
