import { SpawnSyncReturns } from 'node:child_process'
import t from 'tap'
t.capture(process, 'exit', (...a: any[]) =>
  calls.push(['process.exit', a])
)
const calls: [string, any[]][] = []
const { default: buildFail } = (await t.mockImport(
  '../dist/esm/build-fail.js',
  {
    '../dist/esm/tsconfig.js': {},
    '../dist/esm/package.js': { default: { name: 'package' } },
    '../dist/esm/unbuilt-imports.js': {
      unlink: (...a: any[]) => calls.push(['unlinkImports', a]),
    },
    '../dist/esm/self-link.js': {
      unlink: (...a: any[]) => calls.push(['unlinkSelfDep', a]),
    },
    '../dist/esm/set-folder-dialect.js': {
      default: (...a: any[]) => calls.push(['setFolderDialect', a]),
    },
    '../dist/esm/fail.js': {
      default: (...a: any[]) => calls.push(['fail', a]),
    },
    '../dist/esm/console.js': {
      error: (...a: any[]) => calls.push(['console.error', a]),
    },
  }
)) as typeof import('../src/build-fail.js')

buildFail({
  code: 0,
  signal: 'testing',
} as unknown as SpawnSyncReturns<Buffer>)

t.matchSnapshot(calls)
