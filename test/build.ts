import t from 'tap'
import {Package} from '../src/types.js'

const pkg = {} as unknown as Package

let builtCommonJS = false
let builtESM = false
t.beforeEach(() => {
  builtCommonJS = false
  builtESM = false
})

const mocks = {
  '../dist/esm/package.js': { default: pkg },
  '../dist/esm/bins.js': { default: () => {} },
  '../dist/esm/build-commonjs.js': {
    buildCommonJS: () => (builtCommonJS = true),
  },
  '../dist/esm/build-esm.js': { buildESM: () => (builtESM = true) },
  rimraf: { rimrafSync: () => {} },
  '../dist/esm/tsconfig.js': {},
  '../dist/esm/write-package.js': { default: () => {} },
  'sync-content': { syncContentSync: () => {} },
  '../dist/esm/console.js': {
    log: () => {},
    debug: () => {},
    print: () => {},
  },
}

t.test('default settings', async t => {
  await t.mockImport('../dist/esm/build.js', mocks)
  t.equal(builtESM, true)
  t.equal(builtCommonJS, true)
})

t.test('build commonjs only', async t => {
  pkg.tshy = { dialects: ['commonjs'] }
  await t.mockImport('../dist/esm/build.js', mocks)
  t.equal(builtESM, false)
  t.equal(builtCommonJS, true)
})

t.test('build esm only', async t => {
  pkg.tshy = { dialects: ['esm'] }
  await t.mockImport('../dist/esm/build.js', mocks)
  t.equal(builtESM, true)
  t.equal(builtCommonJS, false)
})

t.test('build both', async t => {
  pkg.tshy = { dialects: ['esm', 'commonjs'] }
  await t.mockImport('../dist/esm/build.js', mocks)
  t.equal(builtESM, true)
  t.equal(builtCommonJS, true)
})
