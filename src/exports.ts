import { relative, resolve } from 'node:path/posix'
import type {
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
import type { Package, TshyConfig, TshyExport } from './types.js'
const { esmDialects = [], commonjsDialects = [] } = config

const liveDev =
  config.liveDev &&
  process.env.npm_command !== 'publish' &&
  process.env.npm_command !== 'pack'

const getTargetForDialectCondition = <T extends string>(
  s: string | TshyExport | undefined | null,
  dialect: T,
  condition: T extends 'esm' ? 'import'
  : T extends 'commonjs' ? 'require'
  : T,
  type: T extends 'esm' ? 'esm'
  : T extends 'commonjs' ? 'commonjs'
  : 'esm' | 'commonjs',
  polyfills: Map<string, PolyfillSet> = new Map(),
): string | undefined | null => {
  if (s === undefined) return undefined
  if (typeof s === 'string') {
    // the excluded filename pattern
    const xts = type === 'commonjs' ? '.mts' : '.cts'
    if (s.endsWith(xts)) return undefined
    const pf = dialect === 'commonjs' ? 'cjs' : dialect
    const rel = relative(
      resolve('./src'),
      resolve(polyfills.get(pf)?.map.get(s) ?? s),
    )
    const target = liveDev ? rel : rel.replace(/\.([mc]?)tsx?$/, '.$1js')
    const dt =
      dialect === 'commonjs' || dialect === 'esm' ?
        dialect
      : `${type}/${dialect}`
    return (
      !s || !s.startsWith('./src/') ? s
      : dialects.includes(type) ? `./dist/${dt}/${target}`
      : undefined
    )
  }
  return resolveExport(s, [condition])
}

export const getImpTarget = (
  s: string | TshyExport | undefined | null,
  polyfills: Map<string, PolyfillSet> = new Map(),
) => getTargetForDialectCondition(s, 'esm', 'import', 'esm', polyfills)

export const getReqTarget = (
  s: string | TshyExport | undefined | null,
  polyfills: Map<string, PolyfillSet> = new Map(),
) =>
  getTargetForDialectCondition(
    s,
    'commonjs',
    'require',
    'commonjs',
    polyfills,
  )

const getExports = (
  c: TshyConfig,
  pkgType: 'commonjs' | 'module',
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
    if (s !== null && (typeof s !== 'string' || !s.startsWith('./src/'))) {
      // already been validated, just accept as-is
      e[sub] = s as ConditionalValue
      continue
    }

    /* c8 ignore next - already guarded */
    if (s === null) continue

    const impTarget = getImpTarget(s, polyfills)
    const reqTarget = getReqTarget(s, polyfills)

    // should be impossible
    /* c8 ignore start */
    if (!impTarget && !reqTarget) continue
    /* c8 ignore stop */

    const exp: ConditionalValueObject = (e[sub] = {})
    if (impTarget) {
      for (const d of esmDialects) {
        const source = s && (polyfills.get('esm-' + d)?.rmap.get(s) ?? s)

        const target = getTargetForDialectCondition(
          s,
          d,
          d,
          'esm',
          polyfills,
        )
        if (target) {
          const imp = (exp.import ??= {}) as ConditionalValueObject
          const src =
            pkgType === 'module' || source.endsWith('.mts') ?
              getSourceDialects(source, c)
            : undefined
          const types =
            liveDev ? undefined : (
              { types: target.replace(/\.js$/, '.d.ts') }
            )
          imp[d] = { ...src, ...types, default: target }
        }
      }
    }

    if (reqTarget) {
      for (const d of commonjsDialects) {
        const source =
          s && (polyfills.get('commonjs-' + d)?.rmap.get(s) ?? s)
        const target = getTargetForDialectCondition(
          s,
          d,
          d,
          'commonjs',
          polyfills,
        )
        if (target) {
          const req = (exp.require ??= {}) as ConditionalValueObject
          const src =
            pkgType === 'commonjs' || source.endsWith('.cts') ?
              getSourceDialects(source, c)
            : undefined
          const types =
            liveDev ? undefined : (
              { types: target.replace(/\.js$/, '.d.ts') }
            )
          req[d] = { ...src, ...types, default: target }
        }
      }
    }

    // put the default import/require after all the other special ones.
    if (impTarget) {
      const source = s && (polyfills.get('esm')?.rmap.get(s) ?? s)
      const src =
        pkgType === 'module' || source.endsWith('.mts') ?
          getSourceDialects(source, c)
        : undefined
      const types =
        liveDev ? undefined : (
          { types: impTarget.replace(/\.(m?)js$/, '.d.$1ts') }
        )
      exp.import = {
        ...(exp.import as ConditionalValueObject),
        ...src,
        ...types,
        default: impTarget,
      }
    }
    if (reqTarget) {
      const source = s && (polyfills.get('cjs')?.rmap.get(s) ?? s)
      const src =
        pkgType === 'commonjs' || source.endsWith('.cts') ?
          getSourceDialects(source, c)
        : undefined
      const types =
        liveDev ? undefined : (
          { types: reqTarget.replace(/\.(c?)js$/, '.d.$1ts') }
        )

      exp.require = {
        ...(exp.require as ConditionalValueObject),
        ...src,
        ...types,
        default: reqTarget,
      }
    }
  }
  return e
}

const getSourceDialects = (source: string, c: TshyConfig) => {
  const { sourceDialects } = c
  if (!sourceDialects) return undefined
  return Object.fromEntries(sourceDialects.map(s => [s, source]))
}

export const setMain = (
  c: TshyConfig | undefined,
  pkg: Package & { exports: ExportsSubpaths },
) => {
  pkg.type = pkg.type === 'commonjs' ? 'commonjs' : 'module'
  const mod = resolveExport(pkg.exports['.'], ['require', 'default'])
  const main = c?.main ?? !!mod
  if (main) {
    if (!mod) {
      fail(`could not resolve exports['.'] for tshy.main 'require'`)
      return process.exit(1)
    }
    const types = resolveExport(pkg.exports['.'], ['require', 'types'])
    pkg.main = mod
    if (types && types !== mod) pkg.types = types
    else delete pkg.types
  } else {
    if (c && c.main !== false) delete c.main
    delete pkg.main
    delete pkg.types
  }

  // Set the package module to exports["."]
  const importMod = resolveExport(pkg.exports['.'], ['import', 'default'])
  const module = c?.module ?? !!importMod
  if (module) {
    if (!importMod) {
      fail(`could not resolve exports['.'] for tshy.module 'import'`)
      return process.exit(1)
    }

    pkg.module = importMod
  } else {
    if (c && c.module !== false) delete c.module
    delete pkg.module
  }
}

pkg.exports = getExports(config, pkg.type)

setMain(config, pkg as Package & { exports: ExportsSubpaths })
export default pkg.exports
