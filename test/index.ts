import t from 'tap'
process.env.FORCE_COLOR = '0'
const mockConsole = {
  log: () => {},
  debug: () => {},
}
const logs = t.capture(mockConsole, 'log').args
const debug = t.capture(mockConsole, 'debug').args

let buildCalled = false
await t.mockImport('../dist/esm/index.js', {
  '../dist/esm/console.js': mockConsole,
  '../dist/esm/build.js': () => (buildCalled = true),
})
t.equal(buildCalled, true)
t.match(debug(), [
  ['building', process.cwd()],
  ['tshy config', Object],
  ['exports', Object],
])
t.strictSame(logs(), [['success!']])

t.test('print help message', async t => {
  t.intercept(process, 'argv', {
    value: [process.execPath, 'index.js', '--help'],
  })
  let usageCalled: string | undefined = undefined
  await t.mockImport('../dist/esm/index.js', {
    '../dist/esm/usage.js': {
      default: (n?: string) => (usageCalled = n),
    },
  })
  t.equal(usageCalled, undefined)
})

t.test('print usage and error for unknown arg', async t => {
  t.intercept(process, 'argv', {
    value: [process.execPath, 'index.js', 'xyz'],
  })
  let usageCalled: string | undefined = undefined
  await t.mockImport('../dist/esm/index.js', {
    '../dist/esm/usage.js': {
      default: (n?: string) => (usageCalled = n),
    },
  })
  t.equal(usageCalled, `Unknown argument: xyz`)
})

t.test('watch if --watch specified', async t => {
  t.intercept(process, 'argv', {
    value: [process.execPath, 'index.js', '--watch'],
  })
  let watchCalled = false
  await t.mockImport('../dist/esm/index.js', {
    '../dist/esm/watch.js': {
      default: () => (watchCalled = true),
    },
  })
  t.equal(watchCalled, true)
})
