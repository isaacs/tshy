import t from 'tap'
import { Package } from '../src/types.js'

let failed: undefined | string = undefined

const { default: validImports } = (await t.mockImport(
  '../src/valid-imports.js',
  {
    '../src/fail.js': {
      default: (m: string) => (failed = m),
    },
  }
)) as typeof import('../src/valid-imports.js')

const exits = t.capture(process, 'exit').args

const cases: [pkg: Omit<Package, 'name' | 'version'>, ok: boolean][] =
  [
    [{}, true],
    [{ imports: 'asdf' }, false],
    [{ imports: [] }, false],
    [{ imports: { '#x': {} } }, true],
    [{ imports: { '#x': 'y' } }, true],
    [{ imports: { x: 'y' } }, false],
    [{ imports: { '#': 'y' } }, false],
    [{ imports: { '#x': './src/x' } }, true],
    [{ imports: { '#x': ['./src/x'] } }, false],
  ]

for (const [pkg, ok] of cases) {
  t.test(JSON.stringify({ pkg }), t => {
    const actual = validImports(pkg as Package)
    if (!ok) {
      t.notOk(actual, 'should not be ok')
      t.matchSnapshot(failed, 'failure message')
      t.type(failed, 'string', 'got a failure message')
      t.strictSame(exits(), [[1]], 'exited in error')
    } else {
      t.equal(actual, true, 'should be ok')
      t.equal(failed, undefined, 'no failure message')
      t.strictSame(exits(), [], 'no error exit')
    }
    failed = undefined
    t.end()
  })
}
