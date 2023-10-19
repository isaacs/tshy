import t from 'tap'
import getImports from '../src/built-imports.js'
import { Package } from '../src/types.js'

const cases: [
  pkg: Omit<Package, 'name' | 'version'>,
  expect: Package['imports']
][] = [
  [{}, undefined],
  [{ tshy: {} }, undefined],
  [{ imports: { '#x': 'y' } }, { '#x': 'y' }],
  [
    {
      imports: {
        '#t': './src/t.ts',
        '#x': './src/x.tsx',
        '#b/*': './src/blah/*.ts',
      },
    },
    { '#t': './t.js', '#x': './x.js', '#b/*': './blah/*.js' },
  ],
  [
    {
      imports: {
        '#a': './xyz/a.js',
        '#t': './src/t.ts',
        '#x': './src/x.tsx',
        '#b/*': './src/blah/*.ts',
      },
    },
    {
      '#a': './xyz/a.js',
      '#t': './t.js',
      '#x': './x.js',
      '#b/*': './blah/*.js',
    },
  ],
]

let i = 0
for (const [pkg, expect] of cases) {
  t.test(String(i++), t => {
    t.strictSame(getImports(pkg as Package), expect)
    t.end()
  })
}
