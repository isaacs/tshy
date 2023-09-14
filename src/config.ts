// get the config and package and stuff

import pkg from './package.js'
import sources from './sources.js'
import { Package, TshyConfig } from './types.js'
import validDialects from './valid-dialects.js'
import validExports from './valid-exports.js'

const validConfig = (e: any): e is TshyConfig =>
  !!e &&
  typeof e === 'object' &&
  (e.exports === undefined || validExports(e['exports'])) &&
  (e.dialects === undefined || validDialects(e['dialects']))

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
