import { inspect } from 'node:util'
import t from 'tap'

const polyfills = await t.mockImport('../dist/esm/polyfills.js', {
  '../dist/esm/package.js': {
    default: {
      tshy: {
        esmDialects: ['deno', 'none-found'],
        commonjsDialects: ['blah'],
      },
    },
  },
  '../dist/esm/sources.js': new Set([
    './src/foo.ts',
    './src/foo-cjs.cts',
    './src/foo-blah.cts',
    './src/foo-deno.mts',
    './src/no-poly.ts',
    './src/no-poly.cts',
    './src/no-poly.mts',
    './src/jsx.tsx',
    './src/jsx-cjs.cts',
    './src/poly-without-target-cjs.cts',
  ]),
})

t.match(
  polyfills.default,
  new Map([
    [
      'cjs',
      {
        map: new Map([
          ['./src/foo-cjs.cts', './src/foo.ts'],
          ['./src/jsx-cjs.cts', './src/jsx.tsx'],
        ]),
      },
    ],
    [
      'deno',
      {
        map: new Map([['./src/foo-deno.mts', './src/foo.ts']]),
      },
    ],
    [
      'blah',
      {
        map: new Map([['./src/foo-blah.cts', './src/foo.ts']]),
      },
    ],
  ])
)

t.matchSnapshot(inspect(polyfills.default))
