import fail from './fail.js'
import { Package, TshyConfig } from './types.js'

// this validates the tshy.imports field.
export default ({ imports }: TshyConfig, pkg: Package) => {
  if (imports === undefined) return true
  const { imports: pkgImports = {} } = pkg
  if (typeof imports !== 'object' || Array.isArray(imports)) {
    fail('tshy.imports must be an object if specified')
    return process.exit(1)
  }
  for (const [i, v] of Object.entries(imports)) {
    if (i in pkgImports) {
      fail(
        'tshy.imports keys must not appear in top-level imports, ' +
          'found in both: ' +
          JSON.stringify(i)
      )
      return process.exit(1)
    }
    if (!i.startsWith('#') || i === '#' || i.startsWith('#/')) {
      fail('invalid tshy.imports module specifier: ' + i)
      return process.exit(1)
    }
    if (typeof v !== 'string' || !v.startsWith('./src/')) {
      fail(
        'tshy.imports values must start with "./src/", ' +
          'got: ' +
          JSON.stringify(v)
      )
      return process.exit(1)
    }
  }
  return true
}
