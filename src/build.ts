import chalk from 'chalk'
import { spawnSync, SpawnSyncReturns } from 'node:child_process'
import { renameSync } from 'node:fs'
import { relative, resolve } from 'node:path/posix'
import { rimrafSync } from 'rimraf'
import { syncContentSync } from 'sync-content'
import bins from './bins.js'
import dialects from './dialects.js'
import { fail } from './fail.js'
import polyfills from './polyfills.js'
import setFolderDialect from './set-folder-dialect.js'
import './tsconfig.js'
import writePackage from './write-package.js'

const buildFail = (res: SpawnSyncReturns<Buffer>) => {
  setFolderDialect('src')
  fail('build failed')
  console.error(res)
  process.exit(1)
}

rimrafSync('.tshy-build-tmp')

if (dialects.includes('esm')) {
  setFolderDialect('src', 'esm')
  const res = spawnSync('tsc -p .tshy/esm.json', {
    shell: true,
    stdio: 'inherit',
  })
  setFolderDialect('src')
  if (res.status || res.signal) buildFail(res)
  setFolderDialect('.tshy-build-tmp/esm', 'esm')
  console.error(chalk.cyan.bold('built esm'))
}

if (dialects.includes('commonjs')) {
  setFolderDialect('src', 'commonjs')
  const res = spawnSync('tsc -p .tshy/commonjs.json', {
    shell: true,
    stdio: 'inherit',
  })
  setFolderDialect('src')
  if (res.status || res.signal) buildFail(res)
  setFolderDialect('.tshy-build-tmp/commonjs', 'commonjs')
  console.error(chalk.cyan.bold('built commonjs'), res)
  // apply polyfills
  for (const [f, t] of polyfills.entries()) {
    const stemFrom = resolve(
      '.tshy-build-tmp/commonjs',
      relative(resolve('src'), resolve(f))
    ).replace(/\.cts$/, '')
    const stemTo = resolve(
      '.tshy-build-tmp/commonjs',
      relative(resolve('src'), resolve(t))
    ).replace(/\.ts$/, '')
    renameSync(`${stemFrom}.cjs`, `${stemTo}.js`)
    renameSync(`${stemFrom}.d.cts`, `${stemTo}.d.ts`)
  }
}

syncContentSync('.tshy-build-tmp', 'dist')
rimrafSync('.tshy-build-tmp')
bins()
writePackage()
