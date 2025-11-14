import { SpawnSyncReturns } from 'child_process'
import { readdirSync } from 'fs'
import t from 'tap'

t.cleanSnapshot = s => s.split(process.execPath).join('{NODE}')

const spawnSuccessResult: BuildResult = {
  esmDialect: 'browser',
  code: 0,
}

const spawnFailedResult: BuildResult = {
  esmDialect: 'browser',
  code: 1,
}
let spawnOpResult = spawnSuccessResult

import { spawn as opSpawn } from 'node:child_process'
import { BuildResult } from '../src/build-fail.js'
const spawn = t.captureFn((...a: any[]) => {

  //@ts-ignore
  const opSpawnResult = opSpawn(...a)
  opSpawnResult.emit('close', spawnSuccess.status, spawnSuccess.signal)
})

const output = () =>
  readdirSync('.tshy-build/esm').sort((a, b) =>
    a.localeCompare(b, 'en'),
  )

t.test('basic esm build', async t => {
  spawnOpResult = spawnSuccessResult
  t.chdir(
    t.testdir({
      'package.json': JSON.stringify({
        tshy: {
          esmDialects: ['blah', 'no-overrides'],
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
        'blah-blah.mts': `
          //@ts-ignore
          export const u = 'file://blah/blah.blah'
        `,
        'blah-cjs.cts': `
          import { pathToFileURL } from 'url'
          export const u = pathToFileURL(__filename)
        `,
      },
    }),
  )
  let buildFailed = false
  const { buildESM } = (await t.mockImport(
    '../dist/esm/build-esm.js',
    {
      child_process: { spawn },
      '../dist/esm/build-fail.js': {
        default: () => {
          buildFailed = true
        },
      },
    },
  )) as typeof import('../dist/esm/build-esm.js')
  buildESM()
  t.equal(buildFailed, false)
  t.matchSnapshot(output())
  //t.matchSnapshot(spawnSync.args())
})

t.test('build failure', async t => {
  spawnOpResult = spawnFailedResult
  t.chdir(
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
    }),
  )
  let buildFailed = false
  const { buildESM } = (await t.mockImport(
    '../dist/esm/build-esm.js',
    {
      child_process: { spawn },
      '../dist/esm/build-fail.js': {
        default: () => {
          buildFailed = true
        },
      },
    },
  )) as typeof import('../dist/esm/build-esm.js')
  buildESM()
  t.equal(buildFailed, true)
  t.matchSnapshot(output())
  //t.matchSnapshot(spawnSync.args())
})
