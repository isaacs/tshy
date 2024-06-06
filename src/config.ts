// get the config and package and stuff

import chalk from 'chalk'
import { Minimatch } from 'minimatch'
import * as console from './console.js'
import fail from './fail.js'
import pkg from './package.js'
import sources from './sources.js'
import {
  Package,
  TshyConfig,
  TshyConfigMaybeGlobExports,
} from './types.js'
import validDialects from './valid-dialects.js'
import validExclude from './valid-exclude.js'
import validExports from './valid-exports.js'
import validExtraDialects from './valid-extra-dialects.js'
import validImports from './valid-imports.js'
import validProject from './valid-project.js'

const validBoolean = (e: Record<string, any>, name: string) => {
  const v = e[name]
  if (v === undefined || typeof v === 'boolean') return true
  fail(`tshy.${name} must be a boolean value if specified, got: ` + v)
  return process.exit(1)
}

const isStringArray = (e: any): e is string[] =>
  !!e && Array.isArray(e) && !e.some(e => typeof e !== 'string')

const validConfig = (e: any): e is TshyConfigMaybeGlobExports =>
  !!e &&
  typeof e === 'object' &&
  (e.exports === undefined ||
    typeof e.exports === 'string' ||
    isStringArray(e.exports) ||
    validExports(e.exports)) &&
  (e.dialects === undefined || validDialects(e.dialects)) &&
  (e.project === undefined || validProject(e.project)) &&
  (e.exclude === undefined || validExclude(e.exclude)) &&
  validExtraDialects(e) &&
  validBoolean(e, 'selfLink') &&
  validBoolean(e, 'main') &&
  validBoolean(e, 'liveDev')

const match = (e: string, pattern: Minimatch[]): boolean =>
  pattern.some(m => m.match(e))

const parsePattern = (p: string | string[]): Minimatch[] =>
  Array.isArray(p)
    ? p.map(p => new Minimatch(p.replace(/^\.\//, '')))
    : parsePattern([p])

const getConfig = (
  pkg: Package,
  sources: Set<string>
): TshyConfig => {
  const tshy: TshyConfigMaybeGlobExports = validConfig(pkg.tshy)
    ? pkg.tshy
    : {}
  let exportsConfig = tshy.exports
  if (
    typeof exportsConfig === 'string' ||
    Array.isArray(exportsConfig)
  ) {
    // Strip off the `./src` prefix and the extension
    // exports: "src/**/*.ts" => exports: {"./foo": "./src/foo.ts"}
    const exp: Exclude<TshyConfig['exports'], undefined> = {}
    const pattern: string | string[] = exportsConfig
    const m = parsePattern(pattern)
    for (const e of sources) {
      if (!match(e.replace(/^\.\//, ''), m)) continue
      // index is main, anything else is a subpath
      const sp = /^\.\/src\/index.([mc]?[jt]s|[jt]sx)$/.test(e)
        ? '.'
        : './' +
          e
            .replace(/^\.\/src\//, '')
            .replace(/\.([mc]?[tj]s|[jt]sx)$/, '')
      exp[sp] = `./${e}`
    }
    /* c8 ignore start - should be impossible */
    if (!validExports(exp)) {
      console.error('invalid exports pattern, using default exports')
      delete tshy.exports
      exportsConfig = undefined
    } else {
      /* c8 ignore stop */
      exp['./package.json'] = './package.json'
      tshy.exports = exp
    }
  }
  const config = { ...tshy } as TshyConfig
  const ti = config as TshyConfig & { imports?: any }
  if (ti.imports) {
    console.debug(
      chalk.cyan.dim('imports') +
        ' moving from tshy config to top level'
    )
    pkg.imports = {
      ...pkg.imports,
      ...ti.imports,
    }
    delete ti.imports
  }
  validImports(pkg)
  if (!exportsConfig) {
    const e: Exclude<TshyConfig['exports'], undefined> = {
      './package.json': './package.json',
    }
    for (const i of sources) {
      if (/^\.\/src\/index\.[^\.]+$/.test(i)) {
        e['.'] = i
        break
      }
    }
    config.exports = e
    tshy.exports = e
    exportsConfig = e
  }
  // return the filled out config, but leave the package.json
  // exports as they were, as long as they turned out to be valid.
  pkg.tshy = { ...tshy, exports: exportsConfig }
  return config
}

const config: TshyConfig = getConfig(pkg, sources)
export default config
