// get the config and package and stuff

import fail from './fail.js'
import pkg from './package.js'
import sources from './sources.js'
import { Package, TshyConfig } from './types.js'
import validDialects from './valid-dialects.js'
import validExports from './valid-exports.js'
import validExtraDialects from './valid-extra-dialects.js'
import validImports from './valid-imports.js'

const validBoolean = (e: Record<string, any>, name: string) => {
  const v = e[name]
  if (v === undefined || typeof v === 'boolean') return true
  fail(`tshy.${name} must be a boolean value if specified, got: ` + v)
  return process.exit(1)
}

const validConfig = (e: any): e is TshyConfig =>
  !!e &&
  typeof e === 'object' &&
  (e.exports === undefined || validExports(e.exports)) &&
  (e.dialects === undefined || validDialects(e.dialects)) &&
  validExtraDialects(e) &&
  validBoolean(e, 'selfLink') &&
  validBoolean(e, 'main') &&
  validImports(e, pkg)

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

const config: TshyConfig = getConfig(pkg, sources)
export default config
