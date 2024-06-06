import t from 'tap'
import tsc from '../src/which-tsc.js'
import { accessSync, constants } from 'node:fs'

t.doesNotThrow(
  () => accessSync(tsc, constants.R_OK),
  'tsc is readable'
)
