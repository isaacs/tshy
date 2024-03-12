import { SpawnSyncReturns } from 'child_process'
import { readdirSync } from 'fs'
import t from 'tap'

const cwd = process.cwd()
t.afterEach(() => process.chdir(cwd))

const spawnSuccess: SpawnSyncReturns<Buffer> = {
  status: 0,
  signal: null,
  pid: 123,
  output: [],
  stdout: Buffer.alloc(0),
  stderr: Buffer.alloc(0),
}

const spawnFail: SpawnSyncReturns<Buffer> = {
  status: 1,
  signal: null,
  pid: 123,
  output: [],
  stdout: Buffer.alloc(0),
  stderr: Buffer.alloc(0),
}

import { spawnSync as ogSpawnSync } from 'node:child_process'
let spawnResult = spawnSuccess
const spawnSync = t.captureFn((...a: any[]) => {
  //@ts-ignore
  ogSpawnSync(...a)
  return spawnResult
})

const output = () =>
  readdirSync('.tshy-build/commonjs').sort((a, b) =>
    a.localeCompare(b, 'en')
  )

t.test('basic commonjs build', async t => {
  spawnResult = spawnSuccess
  process.chdir(
    t.testdir({
      'package.json': JSON.stringify({
        tshy: {
          commonjsDialects: ['blah', 'no-overrides'],
          exports: {
            '.': './src/index.ts',
            './blah': './src/blah.ts',
          },
        },
      }),
      src: {
        'index.ts': 'console.log("hello")',
        'blah.ts': `
          //@ts-ignore
          export const u = import.meta.url
        `,
        'blah-blah.cts': `
          //@ts-ignore
          export const u = 'file:///blah/blah.blah'
        `,
        'blah-cjs.cts': `
          import { pathToFileURL } from 'url'
          export const u = String(pathToFileURL(__filename))
        `,
      },
    })
  )

  let buildFailed = false
  const { buildCommonJS } = (await t.mockImport(
    '../dist/esm/build-commonjs.js',
    {
      child_process: { spawnSync },
      '../dist/esm/build-fail.js': {
        default: () => {
          buildFailed = true
        },
      },
    }
  )) as typeof import('../dist/esm/build-commonjs.js')
  buildCommonJS()
  t.equal(buildFailed, false)
  t.matchSnapshot(output())
  t.matchSnapshot(spawnSync.args())
})

t.test('build failure', async t => {
  spawnResult = spawnFail
  process.chdir(
    t.testdir({
      'package.json': JSON.stringify({
        tshy: {
          exports: {
            '.': './src/index.ts',
            './blah': './src/blah.ts',
          },
        },
      }),
      src: {
        'index.ts': 'console.log("hello")',
        'blah.ts': `
          //@ts-ignore
          export const u = import.meta.url
        `,
        'blah-cjs.cts': `
          import { pathToFileURL } from 'url'
          export const u = pathToFileURL(__filename)
        `,
      },
    })
  )
  let buildFailed = false
  const { buildCommonJS } = (await t.mockImport(
    '../dist/esm/build-commonjs.js',
    {
      child_process: { spawnSync },
      '../dist/esm/build-fail.js': {
        default: () => {
          buildFailed = true
        },
      },
    }
  )) as typeof import('../dist/esm/build-commonjs.js')
  buildCommonJS()
  t.equal(buildFailed, true)
  t.matchSnapshot(output())
  t.matchSnapshot(spawnSync.args())
})
