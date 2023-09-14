import t from 'tap'

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
