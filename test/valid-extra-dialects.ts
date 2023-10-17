import t from 'tap'
import { TshyConfig } from '../src/types.js'
const mockFail = {
  default: (..._: any[]) => {},
}
const fails = t.capture(mockFail, 'default').args
const exits = t.capture(process, 'exit').args

const { default: validExtraDialects } = (await t.mockImport(
  '../src/valid-extra-dialects.js',
  {
    '../src/fail.js': mockFail,
  }
)) as typeof import('../src/valid-extra-dialects.js')

const cases: [config: TshyConfig, ok: boolean][] = [
  [{}, true],
  [{ commonjsDialects: ['blah'] }, true],
  [{ esmDialects: ['blah'] }, true],
  [{ esmDialects: ['blah'], commonjsDialects: ['blah'] }, false],
  [{ esmDialects: ['blah'], commonjsDialects: ['bloo'] }, true],
  [{ esmDialects: ['default'] }, false],
  [{ esmDialects: ['import'] }, false],
  [{ esmDialects: ['require'] }, false],
  [{ esmDialects: ['node'] }, false],
  [{ esmDialects: ['commonjs'] }, false],
  [{ esmDialects: ['cjs'] }, false],
  //@ts-expect-error
  [{ esmDialects: [123] }, false],
  //@ts-expect-error
  [{ commonjsDialects: [123] }, false],
]

for (const [config, ok] of cases) {
  t.test(JSON.stringify(config), t => {
    const valid = validExtraDialects(config)
    if (ok) {
      t.equal(valid, true, 'is valid')
      t.strictSame(fails(), [], 'no fails')
      t.strictSame(exits(), [], 'no exits')
    } else {
      t.not(valid, true, 'not valid')
      t.matchSnapshot(fails(), 'failure message')
      t.strictSame(exits(), [[1]], 'exit in error')
    }
    t.end()
  })
}
