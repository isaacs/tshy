import t from 'tap'

const polyfills = await t.mockImport('../dist/esm/polyfills.js', {
  '../dist/esm/sources.js': new Set([
    './src/foo.ts',
    './src/foo-cjs.cts',
    './src/no-poly.ts',
    './src/no-poly.cts',
    './src/no-poly.mts',
    './src/jsx.tsx',
    './src/jsx-cjs.cts',
    './src/poly-without-target-cjs.cts',
  ]),
})

t.strictSame(
  polyfills.default,
  new Map([
    ['./src/foo-cjs.cts', './src/foo.ts'],
    ['./src/jsx-cjs.cts', './src/jsx.tsx'],
  ])
)
