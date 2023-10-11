import addDot from './add-dot.js'
import fail from './fail.js'
import { TshyConfig } from './types.js'
import validExternalExport from './valid-external-export.js'

export default (
  e: any
): e is Exclude<TshyConfig['exports'], undefined> => {
  if (!e || typeof e !== 'object' || Array.isArray(e)) return false
  for (const [sub, exp] of Object.entries(e)) {
    if (sub !== '.' && !sub.startsWith('./')) {
      fail(
        `tshy.exports key must be "." or start with "./", got: ${sub}`
      )
      return process.exit(1)
    }

    // just a module. either a built export, or a simple unbuilt export
    if (typeof exp === 'string') {
      e[sub] = addDot(exp)
      continue
    }

    if (typeof exp !== 'object') {
      fail(
        `tshy.exports ${sub} value must be valid package.json exports ` +
          `value, got: ${JSON.stringify(exp)}`
      )
      return process.exit(1)
    }

    // can be any valid external export, but the resolution of
    // import and require must NOT be in ./src
    if (!validExternalExport(exp)) {
      fail(
        `tshy.exports ${sub} unbuilt exports must not be in ./src, ` +
          `and exports in src must be string values. ` +
          `got: ${JSON.stringify(exp)}`
      )
      return process.exit(1)
    }

    e[sub] = exp
  }
  return true
}
