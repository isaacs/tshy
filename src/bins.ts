// chmod bins after build
import { chmodSync } from 'fs'
import { resolve } from 'path'
import pkg from './package.js'
export default () => {
  const { bin } = pkg
  if (!bin) return
  if (typeof bin === 'string') {
    chmodSync(resolve(bin), 0o755)
  } else {
    for (const v of Object.values(bin)) {
      chmodSync(resolve(v), 0o755)
    }
  }
}
