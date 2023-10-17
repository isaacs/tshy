import t from 'tap'
import validExternalExport from '../src/valid-external-export.js'

const cases: [any, boolean][] = [
  [{}, true],
  [[], true],
  [null, true],
  [undefined, true],
  [{ require: './src/x.js', import: null }, false],
  [{ import: './src/x.js', require: null }, false],
  [{ import: './blah/x.js', require: null }, true],
]

t.plan(cases.length)
for (const [exp, ok] of cases) {
  t.equal(
    validExternalExport(exp),
    ok,
    JSON.stringify(exp) + ' ' + ok
  )
}
