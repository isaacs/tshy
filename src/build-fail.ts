import { SpawnSyncReturns } from 'node:child_process'
import * as console from './console.js'
import fail from './fail.js'
import setFolderDialect from './set-folder-dialect.js'
import './tsconfig.js'

export default (res: SpawnSyncReturns<Buffer>) => {
  setFolderDialect('src')
  fail('build failed')
  console.error(res)
  process.exit(1)
}
