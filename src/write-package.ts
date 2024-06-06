import { writeFileSync } from 'fs'
import { stringify } from 'polite-json'
import pkg from './package.js'

export default () => writeFileSync('package.json', stringify(pkg))
