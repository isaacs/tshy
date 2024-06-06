import t from 'tap'
const exits = t.capture(process, 'exit', () => false).args
const mf = t.captureFn(() => {})
const fails = mf.args
const { default: validExclude } = (await t.mockImport(
  '../src/valid-exclude.js',
  {
    '../src/fail.js': mf,
  }
)) as typeof import('../src/valid-exclude.js')

t.equal(validExclude(['a', 'b']), true)
t.equal(validExclude(['']), true)

t.equal(validExclude([]), false)
const f = fails()
t.matchOnly(f, [[String]])
t.matchOnly(exits(), [[1]])

t.equal(validExclude(false), false)
t.equal(validExclude(true), false)
t.equal(validExclude(123), false)
