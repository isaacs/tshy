import { SpawnSyncReturns } from 'node:child_process'
import * as console from './console.js'
import fail from './fail.js'
import setFolderDialect from './set-folder-dialect.js'
import './tsconfig.js'
import { unlink as unlinkImports } from './unbuilt-imports.js'
import { unlink as unlinkSelfDep } from './self-link.js'
import pkg from './package.js'

export interface BuildResult {
  esmDialect: string
  code: number
  signal?: NodeJS.Signals | null
}

export default (res: SpawnSyncReturns<Buffer> | BuildResult) => {
  setFolderDialect('src')
  unlinkImports(pkg, 'src')
  unlinkSelfDep(pkg, 'src')
  fail('build failed')
  console.error(res)
  process.exit(1)
}
