import { readFileSync } from 'fs'
import t from 'tap'
import { fileURLToPath } from 'url'
import { Package } from '../src/types.js'

const pkg = {} as unknown as Package

let builtCommonJS = false
let builtESM = false
let builtLiveCommonJS = false
let builtLiveESM = false
t.beforeEach(() => {
  builtCommonJS = false
  builtESM = false
  builtLiveCommonJS = false
  builtLiveESM = false
})

const logCall = t.captureFn((_msg: string, _args: any[]) => {})
const calls = logCall.args

const mocks = {
  '../dist/esm/unbuilt-imports.js': {
    link: async (...a: any[]) => logCall('imports.link', a),
    unlink: async (...a: any[]) => logCall('imports.unlink', a),
    save: (...a: any[]) => logCall('imports.save', a),
  },
  '../dist/esm/self-link.js': {
    link: (...a: any[]) => logCall('self-link.link', a),
    unlink: (...a: any[]) => logCall('self-link.unlink', a),
  },
  '../dist/esm/package.js': { default: pkg },
  '../dist/esm/bins.js': { default: () => {} },
  '../dist/esm/build-commonjs.js': {
    buildCommonJS: () => (builtCommonJS = true),
  },
  '../dist/esm/build-live-commonjs.js': {
    buildLiveCommonJS: () => (builtLiveCommonJS = true),
  },
  '../dist/esm/build-esm.js': { buildESM: () => (builtESM = true) },
  '../dist/esm/build-live-esm.js': {
    buildLiveESM: () => (builtLiveESM = true),
  },
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
  const { default: build } = await t.mockImport(
    '../dist/esm/build.js',
    mocks
  )
  await build()
  t.equal(builtESM, true)
  t.equal(builtCommonJS, true)
  t.equal(builtLiveESM, false)
  t.equal(builtLiveCommonJS, false)
  t.matchSnapshot(calls())
})

t.test('liveDev', async t => {
  pkg.tshy = { liveDev: true }
  t.test('no envs', async t => {
    const { default: build } = await t.mockImport(
      '../dist/esm/build.js',
      mocks
    )
    await build()
    t.equal(builtESM, false)
    t.equal(builtCommonJS, false)
    t.equal(builtLiveESM, true)
    t.equal(builtLiveCommonJS, true)
    t.matchSnapshot(calls())
  })
  for (const s of ['pack', 'publish']) {
    t.test(s, async t => {
      t.intercept(process, 'env', {
        value: {
          ...process.env,
          npm_command: s,
        },
      })
      const { default: build } = await t.mockImport(
        '../dist/esm/build.js',
        mocks
      )
      await build()
      t.equal(builtESM, true)
      t.equal(builtCommonJS, true)
      t.equal(builtLiveESM, false)
      t.equal(builtLiveCommonJS, false)
      t.matchSnapshot(calls())
    })
  }
})

t.test('build commonjs only', async t => {
  pkg.tshy = { dialects: ['commonjs'] }
  const { default: build } = await t.mockImport(
    '../dist/esm/build.js',
    mocks
  )
  await build()
  t.equal(builtESM, false)
  t.equal(builtCommonJS, true)
  t.matchSnapshot(calls())
})

t.test('build esm only', async t => {
  pkg.tshy = { dialects: ['esm'] }
  const { default: build } = await t.mockImport(
    '../dist/esm/build.js',
    mocks
  )
  await build()
  t.equal(builtESM, true)
  t.equal(builtCommonJS, false)
  t.matchSnapshot(calls())
})

t.test('build both', async t => {
  pkg.tshy = { dialects: ['esm', 'commonjs'] }
  const { default: build } = await t.mockImport(
    '../dist/esm/build.js',
    mocks
  )
  await build()
  t.equal(builtESM, true)
  t.equal(builtCommonJS, true)
  t.matchSnapshot(calls())
})

t.test('imports linking', async t => {
  // make sure one of them doesn't already have a scripts block
  for (const i of ['imports', 'imports-with-star', 'basic']) {
    t.test(i, async t => {
      t.chdir(
        fileURLToPath(new URL('./fixtures/' + i, import.meta.url))
      )
      const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
      const { default: build } = await t.mockImport(
        '../dist/esm/build.js',
        {
          ...mocks,
          '../dist/esm/package.js': { default: pkg },
          '../dist/esm/unbuilt-imports.js': {
            link: async (...a: any[]) => logCall('imports.link', a),
            unlink: async (...a: any[]) =>
              logCall('imports.unlink', a),
            save: (...a: any[]) => {
              logCall('imports.save', a)
              return i.startsWith('imports')
            },
          },
        }
      )
      await build()
      t.matchSnapshot(calls())
    })
  }
})
