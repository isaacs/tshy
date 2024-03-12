import t from 'tap'
import { Package, TshyConfig } from '../src/types.js'

const cases: [
  config: undefined | TshyConfig,
  sources: string[],
  ok: boolean,
  expect: TshyConfig
][] = [
  [
    undefined,
    [],
    true,
    { exports: { './package.json': './package.json' } },
  ],

  [
    undefined,
    ['./src/index.ts'],
    true,
    {
      exports: {
        './package.json': './package.json',
        '.': './src/index.ts',
      },
    },
  ],

  [
    { selfLink: false },
    ['./src/index.ts'],
    true,
    {
      exports: {
        './package.json': './package.json',
        '.': './src/index.ts',
      },
      selfLink: false,
    },
  ],

  //@ts-expect-error
  [{ dialects: 'yolo' }, [], false, {}],

  [
    { exports: { './blah': { require: './src/notallowed' } } },
    [],
    false,
    {},
  ],

  [
    {
      exclude: ['./src/*.test.ts'],
      exports: { '.': './src/index.ts' },
    },
    ['./src/index.ts'],
    true,
    {
      exclude: ['./src/*.test.ts'],
      exports: { '.': './src/index.ts' },
    },
  ],

  //@ts-expect-error
  [{ main: 'blah' }, [], false, {}],

  //@ts-expect-error
  [{ imports: 'blah' }, [], false, {}],

  //@ts-expect-error
  [{ imports: ['blah'] }, [], false, {}],

  [{ project: 'thisFileDoesNotExist.json' }, [], false, {}],
]

t.plan(cases.length)

for (const [config, sources, ok, expect] of cases) {
  t.test(JSON.stringify({ config, sources, ok }), async t => {
    const exits = t.capture(process, 'exit', () => {
      throw 'exit'
    }).args

    const pkg: Package = {
      name: 'x',
      version: '1.2.3',
      tshy: config,
    }

    let failMsg: undefined | string = undefined
    const result = (await t
      .mockImport('../dist/esm/config.js', {
        '../dist/esm/package.js': { default: pkg },
        '../dist/esm/fail.js': {
          default: (m: string) => (failMsg = m),
        },
        '../dist/esm/sources.js': { getSrcFiles: () => sources },
      })
      .catch(er => {
        if (ok) t.equal(er, undefined, 'did not expect exit')
      })) as typeof import('../dist/esm/config.js')
    if (!ok) {
      t.matchSnapshot(failMsg)
      t.strictSame(exits(), [[1]])
    } else {
      t.strictSame(result.default, expect)
      t.equal(failMsg, undefined)
      t.strictSame(exits(), [])
    }
  })
}
