import fail from './fail.js'
import { Package } from './types.js'
import validExternalExport from './valid-external-export.js'

// validate the package.imports field
export default (pkg: Package) => {
  const { imports } = pkg
  if (imports === undefined) return true
  if (Array.isArray(imports) || typeof imports !== 'object') {
    fail(
      'invalid imports object, must be Record<string, Import>, ' +
        `got: ${JSON.stringify(imports)}`
    )
    return process.exit(1)
  }

  for (const [i, v] of Object.entries(imports)) {
    if (!i.startsWith('#') || i === '#' || i.startsWith('#/')) {
      fail('invalid imports module specifier: ' + i)
      return process.exit(1)
    }
    if (typeof v === 'string') continue
    if (!validExternalExport(v)) {
      fail(
        `unbuilt package.imports ${i} must not be in ./src, ` +
          'and imports in ./src must be string values. got: ' +
          JSON.stringify(v)
      )
      return process.exit(1)
    }
  }
  return true
}
