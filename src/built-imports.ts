// merge tshy.imports with package.json imports

import { Package } from './types.js'

// strip the ./src/ and turn ts extension into js for built imports
// leave unbuilt imports alone, they'll be symlinked
export default (pkg: Package): Package['imports'] => {
  const { imports } = pkg
  if (!imports) return undefined
  return Object.fromEntries(
    Object.entries(imports).map(([k, v]) => [
      k,
      typeof v === 'string' && v.startsWith('./src/')
        ? './' +
          v
            .substring('./src/'.length)
            .replace(/\.([cm]?)ts$/, '.$1js')
            .replace(/\.tsx$/, '.js')
        : v,
    ])
  )
}
