import { Package } from './types.js'

/**
 * Merge imports from package.json with imports from tshy.imports,
 * modifying the paths to point to the built files.
 *
 * For imports from ./src/*, it strips the ./src/ prefix and replaces
 * the .ts extension with .js to point to the built file.
 *
 * Leaves unbuilt imports as-is, they will be symlinked.
 */
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
