import { SpawnSyncReturns } from 'node:child_process'
import * as console from './console.js'
import fail from './fail.js'
import setFolderDialect from './set-folder-dialect.js'
import './tsconfig.js'
import { unlink as unlinkImports } from './unbuilt-imports.js'
import { unlink as unlinkSelfDep } from './self-link.js'
import pkg from './package.js'

export default (res: SpawnSyncReturns<Buffer>) => {
  setFolderDialect('src')
  unlinkImports(pkg, 'src')
  unlinkSelfDep(pkg, 'src')
  fail('build failed')
  console.error(res)
  process.exit(1)
}
