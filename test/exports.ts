import { ConditionalValue } from 'resolve-import'
import t from 'tap'
import { TshyConfig } from '../src/types.js'

const { getImpTarget, getReqTarget } = (await t.mockImport(
  '../src/exports.js',
  {
    '../src/dialects.js': { default: ['esm', 'commonjs'] },
  }
)) as typeof import('../src/exports.js')

const cjs = (await t.mockImport('../src/exports.js', {
  '../src/dialects.js': { default: ['commonjs'] },
})) as typeof import('../src/exports.js')
const esm = (await t.mockImport('../src/exports.js', {
  '../src/dialects.js': { default: ['esm'] },
})) as typeof import('../src/exports.js')

t.equal(getImpTarget(undefined), undefined)
t.equal(getImpTarget('foo.cts'), undefined)
t.equal(getImpTarget({ require: './foo.cts' }), undefined)
t.equal(getImpTarget('./src/foo.cts'), undefined)
t.equal(getImpTarget({ import: './foo.mts' }), './foo.mts')
t.equal(getImpTarget('./src/foo.mts'), './dist/esm/foo.mjs')
t.equal(cjs.getImpTarget(undefined), undefined)
t.equal(cjs.getImpTarget('foo.cts'), undefined)
t.equal(cjs.getImpTarget({ require: './foo.cts' }), undefined)
t.equal(cjs.getImpTarget('./src/foo.cts'), undefined)
t.equal(cjs.getImpTarget({ import: './foo.mts' }), './foo.mts')
t.equal(cjs.getImpTarget('./src/foo.mts'), undefined)
t.equal(esm.getImpTarget(undefined), undefined)
t.equal(esm.getImpTarget('foo.cts'), undefined)
t.equal(esm.getImpTarget({ require: './foo.cts' }), undefined)
t.equal(esm.getImpTarget('./src/foo.cts'), undefined)
t.equal(esm.getImpTarget({ import: './foo.mts' }), './foo.mts')
t.equal(esm.getImpTarget('./src/foo.mts'), './dist/esm/foo.mjs')

const p = new Map([['./src/fill-cjs.cts', './src/fill.ts']])
t.equal(getReqTarget(undefined, p), undefined)
t.equal(getReqTarget('foo.cts', p), 'foo.cts')
t.equal(getReqTarget('foo.mts', p), undefined)
t.equal(getReqTarget({ require: './foo.cts' }, p), './foo.cts')
t.equal(getReqTarget('./src/foo.cts', p), './dist/commonjs/foo.cjs')
t.equal(getReqTarget({ import: './foo.mts' }, p), undefined)
t.equal(getReqTarget('./src/foo.mts', p), undefined)
t.equal(cjs.getReqTarget(undefined, p), undefined)
t.equal(cjs.getReqTarget('foo.cts', p), 'foo.cts')
t.equal(cjs.getReqTarget('foo.mts', p), undefined)
t.equal(cjs.getReqTarget({ require: './foo.cts' }, p), './foo.cts')
t.equal(
  cjs.getReqTarget('./src/foo.cts', p),
  './dist/commonjs/foo.cjs'
)
t.equal(cjs.getReqTarget({ import: './foo.mts' }, p), undefined)
t.equal(cjs.getReqTarget('./src/foo.mts', p), undefined)
t.equal(esm.getReqTarget(undefined, p), undefined)
t.equal(esm.getReqTarget('foo.cts', p), 'foo.cts')
t.equal(esm.getReqTarget('foo.mts', p), undefined)
t.equal(esm.getReqTarget({ require: './foo.cts' }, p), './foo.cts')
t.equal(esm.getReqTarget({ require: './foo.mts' }, p), undefined)
t.equal(esm.getReqTarget('./src/foo.cts', p), undefined)
t.equal(esm.getReqTarget({ import: './foo.mts' }, p), undefined)
t.equal(esm.getReqTarget('./src/foo.mts', p), undefined)
t.equal(
  cjs.getReqTarget('./src/fill-cjs.cts', p),
  './dist/commonjs/fill.js'
)

t.test('setting top level main', async t => {
  // name, pkg, expect, ok
  const cases: [
    string,
    {
      tshy?: TshyConfig
      exports: Record<string, ConditionalValue>
      main?: string
      types?: string
      type?: string
    },
    {
      main?: string
      types?: string
    },
    boolean
  ][] = [
    [
      'main defaults true',
      {
        exports: {
          '.': {
            require: { types: './r.d.ts', default: './r.js' },
            import: { types: './i.d.ts', default: './i.js' },
          },
        },
      },
      { main: './r.js', types: './r.d.ts' },
      true,
    ],
    [
      'main explicit false, removes',
      {
        tshy: { main: false },
        main: './r.js',
        types: './r.d.ts',
        exports: {
          '.': {
            require: { types: './r.d.ts', default: './r.js' },
            import: { types: './i.d.ts', default: './i.js' },
          },
        },
      },
      {},
      true,
    ],
    [
      'main explicit true',
      {
        tshy: { main: true },
        exports: {
          '.': {
            require: { types: './r.d.ts', default: './r.js' },
            import: { types: './i.d.ts', default: './i.js' },
          },
        },
      },
      { main: './r.js', types: './r.d.ts' },
      true,
    ],
    [
      'main commonjs, no types',
      {
        tshy: { main: true },
        exports: {
          '.': {
            require: './r.js',
            import: { types: './i.d.ts', default: './i.js' },
          },
        },
      },
      { main: './r.js' },
      true,
    ],
    [
      'main=false, not set in pj already',
      {
        tshy: { main: false },
        exports: {
          '.': {
            require: { types: './r.d.ts', default: './r.js' },
            import: { types: './i.d.ts', default: './i.js' },
          },
        },
      },
      {},
      true,
    ],
    [
      'main not set, no commonjs main export',
      {
        tshy: {},
        exports: {
          '.': {
            import: { types: './i.d.ts', default: './i.js' },
          },
        },
      },
      {},
      true,
    ],
    [
      'main explicit true, no commonjs module',
      {
        tshy: { main: true },
        exports: {
          '.': {
            import: { types: './i.d.ts', default: './i.js' },
          },
        },
      },
      {},
      false,
    ],
    [
      'invalid main commonjs, no exports',
      {
        tshy: { main: true },
        exports: {},
      },
      {},
      false,
    ],
  ]

  t.plan(cases.length)

  const exits = t.capture(process, 'exit', () => false).args
  const fails: any[][] = []
  const { setMain } = await t.mockImport('../dist/esm/exports.js', {
    '../dist/esm/fail.js': {
      default: (...a: any[]) => fails.push(a),
    },
  })
  for (const [name, pkg, expect, ok] of cases) {
    t.test(name, t => {
      setMain(pkg.tshy, pkg)
      if (ok) {
        t.equal(pkg.main, expect.main)
        t.equal(pkg.types, expect.types)
        t.equal(pkg.type, 'module')
      } else {
        t.strictSame(exits(), [[1]])
        t.matchSnapshot(fails)
        fails.length = 0
      }
      t.end()
    })
  }
})
