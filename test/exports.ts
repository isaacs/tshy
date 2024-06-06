import { ConditionalValue, ExportsSubpaths } from 'resolve-import'
import t, { Test } from 'tap'
import { PolyfillSet } from '../src/polyfills.js'
import { Package, TshyConfig } from '../src/types.js'

// order is relevant in the exports objects we're snapshotting here
t.compareOptions = { sort: false }

const { getImpTarget, getReqTarget } = await t.mockImport<
  typeof import('../src/exports.js')
>('../src/exports.js', {
  '../src/dialects.js': { default: ['esm', 'commonjs'] },
})

const cjs = await t.mockImport<typeof import('../src/exports.js')>(
  '../src/exports.js',
  {
    '../src/dialects.js': { default: ['commonjs'] },
  }
)
const esm = await t.mockImport<typeof import('../src/exports.js')>(
  '../src/exports.js',
  {
    '../src/dialects.js': { default: ['esm'] },
  }
)

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

const p = new Map([
  [
    'cjs',
    Object.assign(new PolyfillSet('commonjs', 'cjs'), {
      map: new Map([['./src/fill-cjs.cts', './src/fill.ts']]),
    }),
  ],
])
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
t.equal(esm.getReqTarget({ require: './foo.mts' }, p), './foo.mts')
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
    [
      'type defaults module',
      {
        exports: {},
      },
      {},
      true,
    ],
    [
      'type=commonjs',
      {
        type: 'commonjs',
        exports: {},
      },
      {},
      true,
    ],
    [
      'type=module',
      {
        type: 'module',
        exports: {},
      },
      {},
      true,
    ],
    [
      'invalide type',
      {
        type: 'invalid type',
        exports: {},
      },
      {},
      true,
    ],
  ]

  t.plan(cases.length)

  const exits = t.capture(process, 'exit', () => false).args
  const fails: any[][] = []
  const { setMain } = await t.mockImport<
    typeof import('../src/exports.js')
  >('../src/exports.js', {
    '../src/fail.js': {
      default: (...a: any[]) => fails.push(a),
    },
  })
  for (const [name, pkg, expect, ok] of cases) {
    t.test(name, t => {
      const { tshy = {}, type } = pkg
      const { main } = tshy
      setMain(pkg.tshy, pkg as Package & { exports: ExportsSubpaths })
      if (ok) {
        t.equal(pkg.main, expect.main)
        t.equal(pkg.types, expect.types)
        t.equal(pkg.type, type === 'commonjs' ? 'commonjs' : 'module')
        if (main === false) t.equal(pkg.tshy?.main, main)
      } else {
        t.strictSame(exits(), [[1]])
        t.matchSnapshot(fails)
        fails.length = 0
      }
      t.end()
    })
  }
})

t.test('extra dialects', async t => {
  const dialectOptions = [undefined, ['commonjs'], ['esm']]
  for (const dialects of dialectOptions) {
    t.test(String(dialects), async t => {
      const esmDialects = ['deno', 'no-overrides']
      const commonjsDialects = ['blah']
      for (const extras of [true, false]) {
        t.test(`extras=${extras}`, async t => {
          const { default: extraDialects } = (await t.mockImport(
            '../dist/esm/exports.js',
            {
              '../dist/esm/package.js': {
                default: {
                  tshy: {
                    ...(extras && { esmDialects, commonjsDialects }),
                    dialects,
                    exports: {
                      '.': './src/index.ts',
                      './foo': './src/foo.ts',
                    },
                  },
                },
              },

              '../dist/esm/sources.js': {
                default: new Set([
                  './src/index.ts',
                  './src/index-blah.cts',
                  './src/index-cjs.cts',
                  './src/index-deno.mts',
                  './src/foo.ts',
                  './src/foo-blah.cts',
                ]),
              },
            }
          )) as typeof import('../dist/esm/exports.js')
          t.matchSnapshot(extraDialects)
        })
      }
    })
  }
  t.end()
})

t.test('liveDev', async t => {
  const pkg: Package = {
    name: 'x',
    version: '1.2.3',
    tshy: {
      liveDev: true,
      dialects: ['commonjs', 'esm'],
      esmDialects: ['deno'],
      commonjsDialects: ['blah'],
      exports: {
        '.': './src/index.ts',
        './package.json': './package.json',
        './foo': './src/foo.mts',
        './foo-cjs': './src/foo.cts',
        './fill': './src/fill.ts',
      },
    },
  }
  const getLiveDev = async (t: Test) => {
    t.chdir(
      t.testdir({
        'package.json': JSON.stringify(pkg),
        src: {
          'index.ts': '',
          'foo.mts': '',
          'foo-deno.mts': '',
          'foo.cts': '',
          'fill.ts': '',
          'fill-cjs.cts': '',
        },
      })
    )
    return await t.mockImport<typeof import('../src/exports.js')>(
      '../src/exports.js',
      {
        '../src/config.js': { default: pkg.tshy },
        '../src/package.js': { default: pkg },
        '../src/dialects.js': { default: ['commonjs', 'esm'] },
        '../src/sources.js': {
          default: new Set([
            './src/index.ts',
            './src/foo.mts',
            './src/foo.cts',
            './src/fill.ts',
            './src/fill-cjs.cts',
          ]),
        },
      }
    )
  }
  t.test('no envs', async t => {
    const ld = await getLiveDev(t)
    t.equal(ld.getImpTarget('foo.cts'), undefined)
    t.equal(ld.getImpTarget({ require: './foo.cts' }), undefined)
    t.equal(ld.getImpTarget('./src/foo.cts'), undefined)
    t.equal(ld.getImpTarget({ import: './foo.mts' }), './foo.mts')
    t.equal(ld.getImpTarget('./src/foo.mts'), './dist/esm/foo.mts')
    t.equal(ld.getImpTarget('./src/index.ts'), './dist/esm/index.ts')
    t.equal(ld.getReqTarget(undefined, p), undefined)
    t.equal(ld.getReqTarget('foo.cts', p), 'foo.cts')
    t.equal(ld.getReqTarget('foo.mts', p), undefined)
    t.equal(ld.getReqTarget({ require: './foo.cts' }, p), './foo.cts')
    t.equal(
      ld.getReqTarget('./src/foo.cts'),
      './dist/commonjs/foo.cts'
    )
    t.equal(ld.getReqTarget({ import: './foo.mts' }, p), undefined)
    t.equal(ld.getReqTarget('./src/foo.mts', p), undefined)
    t.equal(
      ld.getReqTarget('./src/fill-cjs.cts', p),
      './dist/commonjs/fill.ts'
    )
    t.matchSnapshot(pkg.exports)
    delete pkg.exports
    t.end()
  })

  for (const c of ['publish', 'pack']) {
    t.test(c, async t => {
      t.intercept(process, 'env', {
        value: {
          ...process.env,
          npm_command: c,
        },
      })
      const ld = await getLiveDev(t)
      // should be the same as not having liveDev: true
      t.equal(ld.getImpTarget('foo.cts'), undefined)
      t.equal(ld.getImpTarget({ require: './foo.cts' }), undefined)
      t.equal(ld.getImpTarget('./src/foo.cts'), undefined)
      t.equal(ld.getImpTarget({ import: './foo.mts' }), './foo.mts')
      t.equal(ld.getImpTarget('./src/foo.mts'), './dist/esm/foo.mjs')
      t.equal(
        ld.getImpTarget('./src/index.ts'),
        './dist/esm/index.js'
      )
      t.equal(ld.getReqTarget(undefined, p), undefined)
      t.equal(ld.getReqTarget('foo.cts', p), 'foo.cts')
      t.equal(ld.getReqTarget('foo.mts', p), undefined)
      t.equal(
        ld.getReqTarget({ require: './foo.cts' }, p),
        './foo.cts'
      )
      t.equal(
        ld.getReqTarget('./src/foo.cts'),
        './dist/commonjs/foo.cjs'
      )
      t.equal(ld.getReqTarget({ import: './foo.mts' }, p), undefined)
      t.equal(ld.getReqTarget('./src/foo.mts', p), undefined)
      t.equal(
        ld.getReqTarget('./src/fill-cjs.cts', p),
        './dist/commonjs/fill.js'
      )
      t.matchSnapshot(pkg.exports)
      delete pkg.exports
    })
  }
  t.end()
})
