// merge tshy.imports with package.json imports

import { Package, TshyConfig } from './types.js'

// strip the ./src/ and turn ts extension into js
const stripSrc = (ti: TshyConfig['imports']): Package['imports'] => {
  if (!ti) return undefined
  return Object.fromEntries(
    Object.entries(ti).map(([k, v]) => [
      k,
      './' +
        v
          .substring('./src/'.length)
          .replace(/\.([cm]?)ts$/, '.$1js')
          .replace(/\.tsx$/, '.js'),
    ])
  )
}

export default (pkg: Package): Package['imports'] => {
  const { tshy } = pkg
  if (!tshy?.imports && !pkg.imports) return undefined
  return {
    ...pkg.imports,
    ...stripSrc(tshy?.imports),
  }
}
