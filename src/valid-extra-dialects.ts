// validate esmDialects and commonjsDialects
import { readdirSync } from 'node:fs'
import fail from './fail.js'
import type { TshyConfig } from './types.js'

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
  const srcContents = readdirSync('src')

  for (const d of e) {
    if (typeof d !== 'string') {
      fail(`tshy.${which}Dialects must be an array of strings, got: ${d}`)
      return process.exit(1)
    }
    if (srcContents.includes(d)) {
      fail(
        `tshy.${which}Dialects contains a src entry, not allowed: '${d}'`,
      )
      return process.exit(1)
    }
    if (d.includes('/') || d.includes('\\')) {
      fail(`tshy.${which}Dialects entries may not contain slashes: '${d}'`)
      return process.exit(1)
    }
    if (
      d === 'commonjs' ||
      d === 'cjs' ||
      d === 'esm' ||
      d === 'require' ||
      d === 'import' ||
      d === 'source' ||
      d === 'types' ||
      d === 'default'
    ) {
      fail(`tshy.${which}Dialects must not contain '${d}'`)
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
  if (sourceDialects && !validExtraDialectSet(sourceDialects, 'source')) {
    return false
  }
  const srcCjs = arrayOverlap(sourceDialects, commonjsDialects)
  if (srcCjs) {
    fail(
      `tshy.commonjsDialects overlap with tshy.sourceDialects: ${srcCjs}`,
    )
    return process.exit(1)
  }
  const srcEsm = arrayOverlap(sourceDialects, esmDialects)
  if (srcEsm) {
    fail(`tshy.esmDialects overlap with tshy.sourceDialects: ${srcEsm}`)
    return process.exit(1)
  }
  return true
}
