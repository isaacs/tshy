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
  options: SpawnOptions
) => {
  t.equal(cmd, process.execPath)
  t.strictSame(args, [bin])
  t.strictSame(options, { stdio: 'inherit' })
  const child = new EventEmitter()
  setTimeout(() =>
    child.emit('close', spawnResult.code, spawnResult.signal)
  )
  return child
}

const mockWatcher = new EventEmitter()
const mockChokidar = {
  watch: (watchTargets: string[], watchOptions: WatchOptions) => {
    t.strictSame(watchTargets, targets)
    t.match(watchOptions, options)
    return mockWatcher
  },
}

t.test('build whenever changes happen', async t => {
  const { default: watch } = (await t.mockImport(
    '../dist/esm/watch.js',
    {
      chalk: mockChalk,
      child_process: {
        spawn: mockSpawn,
      },
      chokidar: mockChokidar,
    }
  )) as typeof import('../dist/esm/watch.js')
  watch()
  // immediately trigger changes to the pj and other stuff
  mockWatcher.emit('all', 'change', srcPJ)
  mockWatcher.emit('all', 'change', rootPJ)
  mockWatcher.emit('all', 'change', 'src/x.ts')
  // that last one should trigger a rebuild
  await new Promise<void>(r => setTimeout(r, 100))
  t.matchSnapshot(logs())
  t.matchSnapshot(errs())
})

t.test('build failure', async t => {
  spawnResult = spawnExitCode
  const { default: watch } = (await t.mockImport(
    '../dist/esm/watch.js',
    {
      chalk: mockChalk,
      child_process: {
        spawn: mockSpawn,
      },
      chokidar: mockChokidar,
    }
  )) as typeof import('../dist/esm/watch.js')
  watch()
  await new Promise<void>(r => setTimeout(r, 100))
  t.matchSnapshot(logs())
  t.matchSnapshot(errs())
  spawnResult = spawnOK
  mockWatcher.emit('all', 'change', 'src/x.ts')
  await new Promise<void>(r => setTimeout(r, 100))
  t.matchSnapshot(logs())
  t.matchSnapshot(errs())
})
