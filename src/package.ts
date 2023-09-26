// get the package.json data for the cwd

import { readFileSync } from 'fs'
import fail from './fail.js'
import { Package } from './types.js'

const readPkg = (): Package => {
  try {
    return JSON.parse(readFileSync('package.json', 'utf8'))
  } catch (er) {
    fail('failed to read package.json', er as Error)
    process.exit(1)
  }
}

export default readPkg()
