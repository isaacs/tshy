import t from 'tap'

const exits = t.capture(process, 'exit', () => false).args
let failed = false
const { default: validDialects } = (await t.mockImport(
  '../dist/esm/valid-dialects.js',
  {
    '../dist/esm/fail.js': () => (failed = true),
  }
)) as typeof import('../dist/esm/valid-dialects.js')

t.equal(validDialects(['esm', 'commonjs']), true)
t.equal(validDialects(['commonjs']), true)
t.equal(validDialects(['esm']), true)

t.equal(validDialects(false), false)
t.strictSame(exits(), [[1]])
t.equal(failed, true)
failed = false

t.equal(validDialects(['esm', 'blah']), false)
t.strictSame(exits(), [[1]])
t.equal(failed, true)
failed = false
