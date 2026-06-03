import t from 'tap'
import getSideEffects from '../src/built-side-effects.js'
import type { Package } from '../src/types.js'

const cases: [
  pkg: Omit<Package, 'name' | 'version'>,
  expect: Package['sideEffects'],
][] = [
  [{}, undefined],
  [{ tshy: {} }, undefined],
  [{ sideEffects: false }, false],
  [{ sideEffects: true }, true],
  [
    {
      sideEffects: [
        './src/polyfill.ts',
        './src/effect.tsx',
        './src/legacy.cts',
        './src/legacy.mts',
      ],
    },
    ['./polyfill.js', './effect.js', './legacy.cjs', './legacy.mjs'],
  ],
  [
    {
      sideEffects: ['*.css', './dist/keep.js', './src/effect.ts'],
    },
    ['*.css', './dist/keep.js', './effect.js'],
  ],
]

let i = 0
for (const [pkg, expect] of cases) {
  t.test(String(i++), t => {
    t.strictSame(getSideEffects(pkg as Package), expect)
    t.end()
  })
}
