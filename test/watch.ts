import chalk from 'chalk'
import { SpawnOptions } from 'child_process'
import { WatchOptions } from 'chokidar'
import EventEmitter from 'events'
import t from 'tap'
import {
  bin,
  options,
  rootPJ,
  src,
  srcNM,
  srcPJ,
  targets,
} from '../dist/esm/watch.js'
import { writeFileSync } from 'fs'
import { basename, resolve } from 'path'

t.cleanSnapshot = s => s.replace(/\\/g, '/')

t.matchSnapshot({ options, srcPJ, srcNM, src, rootPJ, targets, bin })

if (typeof options.ignored !== 'function') {
  throw new Error('expect options.ignored to be a function')
}
t.equal(options.ignored('./src/package.json'), true)
t.equal(options.ignored('./src/package.json'), true)
t.equal(options.ignored('./src/node_modules/xyz'), true)
t.equal(options.ignored('./src/node_modules'), true)
t.equal(options.ignored('./package.json'), false)
t.equal(options.ignored('./src/x.ts'), false)

const logs = t.capture(console, 'log').args
const errs = t.capture(console, 'error').args

const mockChalk = {
  green: chalk.green,
  cyan: { dim: chalk.cyan.dim },
  red: chalk.red,
}

type SpawnResult = {
  code: number | null
  signal: NodeJS.Signals | null
}
const spawnOK: SpawnResult = { code: 0, signal: null }
const spawnExitCode: SpawnResult = { code: 1, signal: null }
let spawnResult: SpawnResult = spawnOK

const mockSpawn = (
  cmd: string,
  args: string[],
  options: SpawnOptions,
) => {
  t.equal(cmd, process.execPath)
  t.strictSame(args, [bin])
  t.strictSame(options, { stdio: 'inherit' })
  const child = new EventEmitter()
  setTimeout(() =>
    child.emit('close', spawnResult.code, spawnResult.signal),
  )
  return child
}

const mockWatcher = new EventEmitter()
const mockChokidar = {
  watch: (watchTargets: string[], watchOptions: WatchOptions) => {
    t.strictSame(
      new Set(watchTargets.map(w => basename(w))),
      new Set(['src', 'package.json']),
    )
    t.match(watchOptions, options)
    return mockWatcher
  },
}

t.test('build whenever changes happen', async t => {
  t.chdir(
    t.testdir({
      'package.json': JSON.stringify({}),
      src: { 'index.ts': 'export {}' },
    }),
  )
  const {
    default: watch,
    rootPJ,
    src,
    srcPJ,
  } = await t.mockImport<typeof import('../dist/esm/watch.js')>(
    '../dist/esm/watch.js',
    {
      chalk: mockChalk,
      child_process: {
        spawn: mockSpawn,
      },
      chokidar: mockChokidar,
    },
  )
  watch()
  if (!t.equal(rootPJ, resolve(t.testdirName, 'package.json'))) {
    throw new Error(
      'do not proceed, will break actual package.json file',
    )
  }
  // immediately trigger changes to the pj and other stuff
  // this does not trigger a change, because it hasn't changed
  mockWatcher.emit('all', 'change', rootPJ)
  // this is ignored
  mockWatcher.emit('all', 'addDir', src)
  // this is ignored
  mockWatcher.emit('all', 'change', srcPJ)
  // this one should trigger a rebuild
  mockWatcher.emit('all', 'change', 'src/index.ts')
  await new Promise<void>(r => setTimeout(r, 100))
  t.matchSnapshot(logs())
  t.matchSnapshot(errs())
  // now edit the rootPJ and trigger again
  writeFileSync(
    rootPJ,
    JSON.stringify({
      name: 'this is new',
      tshy: {},
    }),
  )
  mockWatcher.emit('all', 'change', rootPJ)
})

t.test('build failure', async t => {
  spawnResult = spawnExitCode
  const { default: watch } = await t.mockImport<
    typeof import('../dist/esm/watch.js')
  >('../dist/esm/watch.js', {
    chalk: mockChalk,
    child_process: {
      spawn: mockSpawn,
    },
    chokidar: mockChokidar,
  })
  watch()
  await new Promise<void>(r => setTimeout(r, 100))
  t.matchSnapshot(logs(), 'logs before change')
  t.matchSnapshot(errs(), 'errs before change')
  mockWatcher.emit('all', 'change', 'src/x.ts')
  await new Promise<void>(r => setTimeout(r, 100))
  t.matchSnapshot(logs(), 'logs after change')
  t.matchSnapshot(errs(), 'errs after change')
  spawnResult = spawnOK
})
