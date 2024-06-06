import { existsSync, renameSync, unlinkSync } from 'fs'

const unlink = (f: string) => existsSync(f) && unlinkSync(f)
const rename = (f: string, to: string) =>
  existsSync(f) && renameSync(f, to)

export default {
  unlink,
  rename,
}
