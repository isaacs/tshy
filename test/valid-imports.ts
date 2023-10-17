import t from 'tap'
import { Package, TshyConfig } from '../src/types.js'

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

const cases: [
  conf: TshyConfig,
  pkg: Omit<Package, 'name' | 'version'>,
  ok: boolean
][] = [
  [{}, {}, true],
  //@ts-expect-error
  [{ imports: 'asdf' }, {}, false],
  //@ts-expect-error
  [{ imports: [] }, {}, false],
  //@ts-expect-error
  [{ imports: { '#x': {} } }, {}, false],
  [{ imports: { '#x': 'y' } }, {}, false],
  [{ imports: { x: 'y' } }, {}, false],
  [{ imports: { '#': 'y' } }, {}, false],
  [
    { imports: { '#x': './src/x' } },
    { imports: { '#x': {} } },
    false,
  ],
  [{ imports: { '#x': './src/x' } }, {}, true],
]

for (const [config, pkg, ok] of cases) {
  t.test(JSON.stringify({ config, pkg }), t => {
    const actual = validImports(config, pkg as Package)
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
