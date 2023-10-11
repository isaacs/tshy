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
import polyfills from './polyfills.js'
import { resolveExport } from './resolve-export.js'
import { Package, TshyConfig, TshyExport } from './types.js'

export const getImpTarget = (
  s: string | TshyExport | undefined | null
): string | undefined | null => {
  if (s === undefined) return undefined
  if (typeof s === 'string') {
    const imp = s.endsWith('.cts') ? undefined : s
    return !imp || !imp.startsWith('./src/')
      ? imp
      : dialects.includes('esm')
      ? `./dist/esm/${relative(
          resolve('./src'),
          resolve(imp)
        ).replace(/\.(m?)tsx?$/, '.$1js')}`
      : undefined
  }
  return resolveExport(s, ['import'])
}

export const getReqTarget = (
  s: string | TshyExport | undefined | null,
  polyfills: Map<string, string>
): string | null | undefined => {
  if (s === undefined) return undefined
  if (typeof s === 'string') {
    const req = s.endsWith('.mts') ? undefined : s
    return !req || !req.startsWith('./src/')
      ? req
      : dialects.includes('commonjs')
      ? `./dist/commonjs/${relative(
          resolve('./src'),
          resolve(polyfills.get(req) || req)
        ).replace(/\.(c?)tsx?$/, '.$1js')}`
      : undefined
  }
  return getReqTarget(resolveExport(s, ['require']), polyfills)
}

export const getExports = (
  c: TshyConfig,
  polyfills: Map<string, string>
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

    const impTarget = getImpTarget(s)
    const reqTarget = getReqTarget(s, polyfills)

    // should be impossible
    /* c8 ignore start */
    if (!impTarget && !reqTarget) continue
    /* c8 ignore stop */

    const exp: ConditionalValueObject = (e[sub] = {})
    if (impTarget) {
      exp.import = {
        types: impTarget.replace(/\.(m?)js$/, '.d.$1ts'),
        default: impTarget,
      }
    }
    if (reqTarget) {
      exp.require = {
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
    if (c) delete c.main
    delete pkg.main
    delete pkg.types
  }
  pkg.type = 'module'
}

// These are all defined by exports, so it's just confusing otherwise
delete pkg.module
pkg.exports = getExports(config, polyfills)
setMain(config, pkg as Package & { exports: ExportsSubpaths })
export default pkg.exports
