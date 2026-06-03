// rewrite package.json sideEffects for the built dialect folders

import type { Package } from './types.js'

// strip the ./src/ and turn ts extension into js for built paths,
// mirroring the behavior of built-imports. boolean values and paths
// that don't point into ./src/ are left alone.
export default (pkg: Package): Package['sideEffects'] => {
  const { sideEffects } = pkg
  if (sideEffects === undefined) return undefined
  if (typeof sideEffects === 'boolean') return sideEffects
  return sideEffects.map(v =>
    typeof v === 'string' && v.startsWith('./src/') ?
      './' +
      v
        .substring('./src/'.length)
        .replace(/\.([cm]?)ts$/, '.$1js')
        .replace(/\.tsx$/, '.js')
    : v,
  )
}
