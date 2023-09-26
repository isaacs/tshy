import t from 'tap'
import { resolveExport } from '../src/resolve-export.js'

type C = 'import' | 'require' | 'types'
const cases: [
  exp: any,
  m: C | C[],
  expect: string | null | undefined
][] = [
  [null, 'import', null],
  [null, 'require', null],
  [1, 'import', undefined],
  [1, 'require', undefined],
  ['foo.xyz', 'import', 'foo.xyz'],
  ['foo.xyz', 'require', 'foo.xyz'],
  [{ require: 'x.js' }, 'require', 'x.js'],
  [{ require: 'x.js' }, 'import', undefined],
  [[{ require: 'x.js' }], 'require', 'x.js'],
  [[{ require: 'x.js' }], 'import', undefined],
  [{ import: 'x.js' }, 'import', 'x.js'],
  [{ import: 'x.js' }, 'require', undefined],
  [[{ import: 'x.js' }], 'import', 'x.js'],
  [[{ import: 'x.js' }], 'require', undefined],
  [{ node: 'x.js' }, 'import', 'x.js'],
  [{ node: 'x.js' }, 'require', 'x.js'],
  [{ default: 'x.js' }, 'import', 'x.js'],
  [{ default: 'x.js' }, 'require', 'x.js'],
  [[{ require: 'r.js' }, 'd.js'], 'require', 'r.js'],
  [[{ require: 'r.js' }, 'd.js'], 'import', 'd.js'],
  [
    [{ require: [{ types: 'r.d.ts' }, 'r.js'] }, 'd.js'],
    'import',
    'd.js',
  ],
  [
    [{ require: { types: 'r.d.ts', default: 'r.js' } }, 'd.js'],
    ['require', 'types'],
    'r.d.ts',
  ],
  [
    [{ require: { default: 'r.js', types: 'r.d.ts' } }, 'd.js'],
    ['require', 'types'],
    'r.js',
  ],
  [
    [{ require: { default: null, types: 'r.d.ts' } }, 'd.js'],
    ['require', 'types'],
    null,
  ],
]

t.plan(cases.length)
for (const [exp, m, expect] of cases) {
  const cond = Array.isArray(m) ? m : [m]
  t.equal(
    resolveExport(exp, cond),
    expect,
    `${m} ${JSON.stringify(exp)}`
  )
}
