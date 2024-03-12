import fail from './fail.js'
import { FailureReasonCallback, Package } from './types.js'
import validExternalExport from './valid-external-export.js'
import { Imports } from 'resolve-import'

const noop = () => {}

export const isValidImportsConfig = (
  imports: any,
  onFail: FailureReasonCallback = noop
): imports is Imports => {
  if (imports === undefined) return true
  if (Array.isArray(imports) || typeof imports !== 'object') {
    onFail(
      'invalid imports object, must be Record<string, Import>, ' +
        `got: ${JSON.stringify(imports)}`
    )
    return false
  }

  for (const [i, v] of Object.entries(imports)) {
    if (!i.startsWith('#') || i === '#' || i.startsWith('#/')) {
      onFail('invalid imports module specifier: ' + i)
      return false
    }
    if (typeof v === 'string') continue
    if (!validExternalExport(v)) {
      onFail(
        `unbuilt package.imports ${i} must not be in ./src, ` +
          'and imports in ./src must be string values. got: ' +
          JSON.stringify(v)
      )
      return false
    }
  }

  return true
}

// validate the package.imports field
export const packageHasValidImportsConfig = (pkg: Package) => {
  const { imports } = pkg

  const result = isValidImportsConfig(imports, reason => {
    fail(reason)
    return process.exit(1)
  })

  return result
}

export default packageHasValidImportsConfig
