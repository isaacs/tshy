import { writeFileSync } from 'fs'
import pkg from './package.js'

export default () => {
  writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n')
}
