import t from 'tap'
const logs = t.capture(console, 'log').args
const errors = t.capture(console, 'error').args

const env = process.env
t.beforeEach(t => t.intercept(process, 'env', { value: { ...env } }))

t.test('no verbosity setting', async t => {
  delete process.env.TSHY_VERBOSE
  const console = (await t.mockImport(
    '../dist/esm/console.js'
  )) as typeof import('../dist/esm/console.js')
  console.log('hello')
  console.debug('debug')
  console.error('error')
  t.strictSame(logs(), [])
  t.strictSame(errors(), [])
  console.print()
  t.strictSame(logs(), [])
  t.strictSame(errors(), [['debug'], ['error']])
})

t.test('verbose=1', async t => {
  process.env.TSHY_VERBOSE = '1'
  const console = (await t.mockImport(
    '../dist/esm/console.js'
  )) as typeof import('../dist/esm/console.js')
  console.log('hello')
  console.debug('debug')
  console.error('error')
  t.strictSame(logs(), [['hello']])
  t.strictSame(errors(), [['error']])
  console.print()
  t.strictSame(logs(), [])
  t.strictSame(errors(), [['debug']])
})

t.test('verbose=2', async t => {
  process.env.TSHY_VERBOSE = '2'
  const console = (await t.mockImport(
    '../dist/esm/console.js'
  )) as typeof import('../dist/esm/console.js')
  console.log('hello')
  console.debug('debug')
  console.error('error')
  t.strictSame(logs(), [['hello']])
  t.strictSame(errors(), [['debug'], ['error']])
  console.print()
  t.strictSame(logs(), [])
  t.strictSame(errors(), [])
})
