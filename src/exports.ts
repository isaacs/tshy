import { relative, resolve } from 'node:path/posix'
import config from './config.js'
import dialects from './dialects.js'
import polyfills from './polyfills.js'
import { Export, TshyConfig, TshyExport } from './types.js'

const getImpTarget = (
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
    return getImpTarget(s.import)
  }
}

const getReqTarget = (
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
    return getReqTarget(s.require, polyfills)
  }
}

const getExports = (
  c: TshyConfig,
  polyfills: Map<string, string>
): Record<string, Export> => {
  if (!c.exports) {
    fail('no exports on tshy config (is there code in ./src?)')
    process.exit(1)
  }
  const e: Record<string, Export> = {}
  for (const [sub, s] of Object.entries(c.exports)) {
    const impTarget = getImpTarget(s)
    const reqTarget = getReqTarget(s, polyfills)

    // only possible for exports outside of ./src
    const types = typeof s !== 'string' && s.types

    if (typeof s !== 'string' || !s.startsWith('./src/')) {
      if (impTarget === reqTarget) {
        if (impTarget === undefined) continue
        if (types) {
          e[sub] = {
            import: impTarget,
            require: reqTarget,
            types,
          }
        } else if (impTarget !== undefined) e[sub] = impTarget
        continue
      }
      if (types) {
        e[sub] = {
          types,
          import: impTarget,
          require: reqTarget,
        }
        continue
      }
    }

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

import { fail } from './fail.js'
import pkg from './package.js'
export default pkg.exports = getExports(config, polyfills)
