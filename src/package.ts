// get the package.json data for the cwd

import { readFileSync } from 'fs'
import { JSONResult, parse, stringify } from 'polite-json'
import fail from './fail.js'
import { Package } from './types.js'

const isPackage = (pkg: JSONResult): pkg is Package =>
  !!pkg && typeof pkg === 'object' && !Array.isArray(pkg)

const readPkg = (): Package => {
  try {
    const res = parse(readFileSync('package.json', 'utf8'))
    if (isPackage(res)) return res
    throw new Error(
      'Invalid package.json contents: ' + stringify(res)
    )
  } catch (er) {
    fail('failed to read package.json', er as Error)
    process.exit(1)
  }
}

export default readPkg()
