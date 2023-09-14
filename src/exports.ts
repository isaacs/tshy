import { relative, resolve } from 'node:path/posix'
import config from './config.js'
import dialects from './dialects.js'
import { fail } from './fail.js'
import pkg from './package.js'
import polyfills from './polyfills.js'
import { resolveExport } from './resolve-export.js'
import { Export, TshyConfig, TshyExport } from './types.js'

export const getImpTarget = (
  s: string | TshyExport | undefined
): string | undefined => {
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
  if (s && typeof s === 'object') {
    return resolveExport(s, 'import')
  }
}

export const getReqTarget = (
  s: string | TshyExport | undefined,
  polyfills: Map<string, string>
): string | undefined => {
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
  if (s && typeof s === 'object') {
    return getReqTarget(resolveExport(s, 'require'), polyfills)
  }
}

export const getExports = (
  c: TshyConfig,
  polyfills: Map<string, string>
): Record<string, Export> => {
  // by this time it always exports, will get the default if missing
  /* c8 ignore start */
  if (!c.exports) {
    fail('no exports on tshy config (is there code in ./src?)')
    process.exit(1)
  }
  /* c8 ignore stop */
  const e: Record<string, Export> = {}
  for (const [sub, s] of Object.entries(c.exports)) {
    const impTarget = getImpTarget(s)
    const reqTarget = getReqTarget(s, polyfills)

    // external export, not built by us
    if (typeof s !== 'string' || !s.startsWith('./src/')) {
      // already been validated, just accept as-is
      e[sub] = s as Export
      continue
    }

    // should be impossible
    /* c8 ignore start */
    if (!impTarget && !reqTarget) continue
    /* c8 ignore stop */

    const exp: Export = (e[sub] = {})
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

// These are all defined by exports, so it's just confusing otherwise
delete pkg.module
delete pkg.main
delete pkg.types
export default pkg.exports = getExports(config, polyfills)
