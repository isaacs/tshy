import { existsSync, renameSync } from 'fs'

const rename = (f: string, to: string) =>
  existsSync(f) && renameSync(f, to)

export default {
  rename,
}
