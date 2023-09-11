// get the config and package and stuff

import { fail } from './fail.js'
import { Dialect, Package, TshyConfig, TshyExport } from './types.js'

const validConfig = (e: any): e is TshyConfig =>
  !!e &&
  typeof e === 'object' &&
  (e.exports === undefined || validExports(e['exports'])) &&
  (e.dialects === undefined || validDialects(e['dialects']))

const isDialect = (d: any): d is Dialect =>
  d === 'commonjs' || d === 'esm'

const validDialects = (
  d: any
): d is Exclude<TshyConfig['dialects'], undefined> =>
  !!d && Array.isArray(d) && !d.some(d => !isDialect(d))

const validExports = (
  e: any
): e is Exclude<TshyConfig['exports'], undefined> => {
  if (!e) return false
  if (typeof e !== 'object') return false
  for (const [sub, exp] of Object.entries(e)) {
    if (sub !== '.' && !sub.startsWith('./')) {
      fail(
        `tshy.exports key must be "." or start with "./", got: ${sub}`
      )
      process.exit(1)
    }
    if (typeof exp === 'string') {
      e[sub] = addDot(exp)
      continue
    }
    if (typeof exp !== 'object' || !exp || Array.isArray(exp)) {
      fail(
        `tshy.exports ${sub} value must be string or import/require object, ` +
          `got: ${JSON.stringify(exp)}`
      )
      process.exit(1)
    }
    const { import: i, require: r } = exp as Exclude<
      TshyExport,
      string
    >
    if (!i && !e) {
      fail(
        `tshy.exports ${sub} needs require or import, ` +
          `got: ${JSON.stringify(exp)}`
      )
      process.exit(1)
    }
    if (
      (i !== undefined && typeof i !== 'string') ||
      (r !== undefined && typeof r !== 'string')
    ) {
      fail(
        `tshy.exports ${sub} import/require must be strings, ` +
          `got: ${JSON.stringify(exp)}`
      )
      process.exit(1)
    }
    if (
      (i !== undefined && join(i).startsWith('src/')) ||
      (r !== undefined && join(r).startsWith('src/'))
    ) {
      fail(
        `tshy.exports ${sub} in src/ must be string paths, ` +
          `got: ${JSON.stringify(exp)}`
      )
      process.exit(1)
    }
    e[sub] = {}
    if (e[sub].types) e[sub].types = addDot(e[sub].types)
    if (e[sub].import) e[sub].types = addDot(e[sub].import)
    if (e[sub].require) e[sub].types = addDot(e[sub].require)
  }
  if (e.dialects) {
    if (!validDialects(e.dialects)) {
      fail(
        `tshy.dialects must be array containing 'esm' and/or 'commonjs', ` +
          `got: ${JSON.stringify(e.dialects)}`
      )
    }
  }
  return true
}

const addDot = (s: string) => `./${join(s)}`

const getConfig = (
  pkg: Package,
  sources: Set<string>
): TshyConfig => {
  const tshy: TshyConfig = validConfig(pkg.tshy) ? pkg.tshy : {}
  if (tshy.exports) return tshy
  const e: Exclude<TshyConfig['exports'], undefined> = {
    './package.json': './package.json',
  }
  for (const i of sources) {
    if (/^\.\/src\/index\.[^\.]+$/.test(i)) {
      e['.'] = i
      break
    }
  }
  pkg.tshy = tshy
  tshy.exports = e
  return tshy
}

import { join } from 'path/posix'
import pkg from './package.js'
import sources from './sources.js'

const config: TshyConfig = getConfig(pkg, sources)
export default config
