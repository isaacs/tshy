import t from 'tap'

const exits = t.capture(process, 'exit', () => false).args
let failed: string | undefined = undefined
const { default: validExports } = (await t.mockImport(
  '../dist/esm/valid-exports.js',
  {
    '../dist/esm/fail.js': (m: string) => (failed = m),
  }
)) as typeof import('../dist/esm/valid-exports.js')

t.beforeEach(() => (failed = undefined))

const cases: [any, boolean][] = [
  [false, false],
  [null, false],
  [[], false],
  [{ x: './src/x.ts' }, false],
  [{ './b': { require: './src/blah.ts' } }, false],
  [{ './b': './src/blah.ts' }, true],
  [{ './b': 'src/b.ts' }, true],
  [{ './B': 8 }, false],
  [{ './b': { require: './blah.js' } }, true],
]

t.plan(cases.length)

for (const [exp, ok] of cases) {
  t.test(JSON.stringify(exp) + ' ' + ok, async t => {
    const v = validExports(exp)
    if (!ok) {
      t.equal(v, false)
      t.matchSnapshot(failed, 'message')
      t.matchSnapshot(JSON.stringify(exits()), 'exits')
    } else {
      t.equal(v, true, failed || 'should be valid')
      t.equal(failed, undefined)
      t.strictSame(exits(), [])
      t.matchSnapshot(exp, 'export result')
    }
  })
}
