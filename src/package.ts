// get the package.json data for the cwd

import { readFileSync } from 'fs'
import fail from './fail.js'
import { Package } from './types.js'

const readPkg = (): Package => {
  try {
    return Object.assign(
      JSON.parse(readFileSync('package.json', 'utf8')),
      { type: 'module' }
    )
  } catch (er) {
    fail('failed to read package.json', er as Error)
    process.exit(1)
  }
}

export default readPkg()
