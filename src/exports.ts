import { relative, resolve } from 'node:path/posix'
import {
  ConditionalValue,
  ConditionalValueObject,
  ExportsSubpaths,
} from 'resolve-import'
import config from './config.js'
import dialects from './dialects.js'
import fail from './fail.js'
import pkg from './package.js'
import type { PolyfillSet } from './polyfills.js'
import polyfills from './polyfills.js'
import { resolveExport } from './resolve-export.js'
import { Package, TshyConfig, TshyExport } from './types.js'
const { esmDialects = [], commonjsDialects = [] } = config

const liveDev =
  config.liveDev &&
  process.env.npm_command !== 'publish' &&
  process.env.npm_command !== 'pack'

const getTargetForDialectCondition = <T extends string>(
  s: string | TshyExport | undefined | null,
  dialect: T,
  condition: T extends 'esm'
    ? 'import'
    : T extends 'commonjs'
    ? 'require'
    : T,
  type: T extends 'esm'
    ? 'esm'
    : T extends 'commonjs'
    ? 'commonjs'
    : 'esm' | 'commonjs',
  polyfills: Map<string, PolyfillSet> = new Map()
): string | undefined | null => {
  if (s === undefined) return undefined
  if (typeof s === 'string') {
    // the excluded filename pattern
    const xts = type === 'commonjs' ? '.mts' : '.cts'
    if (s.endsWith(xts)) return undefined
    const pf = dialect === 'commonjs' ? 'cjs' : dialect
    const rel = relative(
      resolve('./src'),
      resolve(polyfills.get(pf)?.map.get(s) ?? s)
    )
    const target = liveDev
      ? rel
      : rel.replace(/\.([mc]?)tsx?$/, '.$1js')
    return !s || !s.startsWith('./src/')
      ? s
      : dialects.includes(type)
      ? `./dist/${dialect}/${target}`
      : undefined
  }
  return resolveExport(s, [condition])
}

export const getImpTarget = (
  s: string | TshyExport | undefined | null,
  polyfills: Map<string, PolyfillSet> = new Map()
) =>
  getTargetForDialectCondition(s, 'esm', 'import', 'esm', polyfills)

export const getReqTarget = (
  s: string | TshyExport | undefined | null,
  polyfills: Map<string, PolyfillSet> = new Map()
) =>
  getTargetForDialectCondition(
    s,
    'commonjs',
    'require',
    'commonjs',
    polyfills
  )

const getExports = (
  c: TshyConfig
): Record<string, ConditionalValue> => {
  // by this time it always exports, will get the default if missing
  /* c8 ignore start */
  if (!c.exports) {
    fail('no exports on tshy config (is there code in ./src?)')
    return process.exit(1)
  }
  /* c8 ignore stop */
  const e: Record<string, ConditionalValue> = {}
  for (const [sub, s] of Object.entries(c.exports)) {
    // external export, not built by us
    if (
      s !== null &&
      (typeof s !== 'string' || !s.startsWith('./src/'))
    ) {
      // already been validated, just accept as-is
      e[sub] = s as ConditionalValue
      continue
    }

    const impTarget = getImpTarget(s, polyfills)
    const reqTarget = getReqTarget(s, polyfills)

    // should be impossible
    /* c8 ignore start */
    if (!impTarget && !reqTarget) continue
    /* c8 ignore stop */

    const exp: ConditionalValueObject = (e[sub] = {})
    if (impTarget) {
      for (const d of esmDialects) {
        const source = s && (polyfills.get(d)?.map.get(s) ?? s)

        const target = getTargetForDialectCondition(
          s,
          d,
          d,
          'esm',
          polyfills
        )
        if (target) {
          exp[d] = liveDev
            ? {
                source,
                default: target,
              }
            : {
                source,
                types: target.replace(/\.js$/, '.d.ts'),
                default: target,
              }
        }
      }
    }

    if (reqTarget) {
      for (const d of commonjsDialects) {
        const source = s && (polyfills.get(d)?.map.get(s) ?? s)
        const target = getTargetForDialectCondition(
          s,
          d,
          d,
          'commonjs',
          polyfills
        )
        if (target) {
          exp[d] = liveDev
            ? {
                source,
                default: target,
              }
            : {
                source,
                types: target.replace(/\.js$/, '.d.ts'),
                default: target,
              }
        }
      }
    }
    // put the default import/require after all the other special ones.
    if (impTarget) {
      exp.import = liveDev
        ? {
            source: s,
            default: impTarget,
          }
        : {
            source: s,
            types: impTarget.replace(/\.(m?)js$/, '.d.$1ts'),
            default: impTarget,
          }
    }
    if (reqTarget) {
      exp.require = liveDev
        ? {
            source: s,
            default: reqTarget,
          }
        : {
            source: s,
            types: reqTarget.replace(/\.(c?)js$/, '.d.$1ts'),
            default: reqTarget,
          }
    }
  }
  return e
}

export const setMain = (
  c: TshyConfig | undefined,
  pkg: Package & { exports: ExportsSubpaths }
) => {
  const mod = resolveExport(pkg.exports['.'], ['require'])
  const main = c?.main ?? !!mod
  if (main) {
    if (!mod) {
      fail(`could not resolve exports['.'] for tshy.main 'require'`)
      return process.exit(1)
    }
    const types = resolveExport(pkg.exports['.'], [
      'require',
      'types',
    ])
    pkg.main = mod
    if (types && types !== mod) pkg.types = types
    else delete pkg.types
  } else {
    if (c && c.main !== false) delete c.main
    delete pkg.main
    delete pkg.types
  }
  pkg.type = pkg.type === 'commonjs' ? 'commonjs' : 'module'
}

// These are all defined by exports, so it's just confusing otherwise
delete pkg.module
pkg.exports = getExports(config)
setMain(config, pkg as Package & { exports: ExportsSubpaths })
export default pkg.exports
