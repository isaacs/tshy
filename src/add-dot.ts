import { join } from 'node:path/posix'
export default (s: string) => `./${join(s)}`
