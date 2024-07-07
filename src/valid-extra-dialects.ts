// validate esmDialects and commonjsDialects
import fail from './fail.js'
import { TshyConfig } from './types.js'

const arrayOverlap = (
  a: string[] | undefined,
  b: string[] | undefined,
): string | false => {
  if (!a || !b) return false
  for (const av of a) {
    if (b.includes(av)) return av
  }
  return false
}

const validExtraDialectSet = (
  e: string[],
  which: 'commonjs' | 'esm' | 'source',
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
      d === 'source' ||
      d === 'default'
    ) {
      fail(
        `tshy.${which}Dialects must not contain ${JSON.stringify(d)}`,
      )
      return process.exit(1)
    }
  }
  return true
}

export default ({
  commonjsDialects,
  esmDialects,
  sourceDialects,
}: TshyConfig) => {
  if (
    commonjsDialects === undefined &&
    esmDialects === undefined &&
    sourceDialects === undefined
  ) {
    return true
  }
  if (
    commonjsDialects &&
    !validExtraDialectSet(commonjsDialects, 'commonjs')
  ) {
    return false
  }
  if (esmDialects && !validExtraDialectSet(esmDialects, 'esm')) {
    return false
  }
  if (
    sourceDialects &&
    !validExtraDialectSet(sourceDialects, 'source')
  ) {
    return false
  }
  for (const [aname, bname, a, b] of [
    [
      'commonjsDialects',
      'esmDialects',
      commonjsDialects,
      esmDialects,
    ],
    [
      'commonjsDialects',
      'sourceDialects',
      commonjsDialects,
      sourceDialects,
    ],
    ['esmDialects', 'sourceDialects', esmDialects, sourceDialects],
  ] as const) {
    const overlap = arrayOverlap(a, b)
    if (!overlap) continue
    fail(
      `${aname} and ${bname} must be unique, found ${overlap} in both lists`,
    )
    return process.exit(1)
  }
  return true
}
