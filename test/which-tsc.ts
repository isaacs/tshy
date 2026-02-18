import t from 'tap'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

t.test('resolve from current project if present, default', async t => {
  t.chdir(
    t.testdir({
      node_modules: {
        '.bin': {
          tsc: t.fixture('symlink', '../typescript/bin/tsc'),
        },
        typescript: {
          'package.json': JSON.stringify({
            bin: './bin/tsc',
            exports: {
              './package.json': './package.json',
            },
          }),
          bin: {
            tsc: 'imma typa script complier',
          },
        },
      },
    }),
  )
  const { default: tsc } = await t.mockImport<
    typeof import('../src/which-tsc.js')
  >('../src/which-tsc.js', {
    '../src/config.js': {},
  })
  t.equal(tsc, resolve(t.testdirName, 'node_modules/.bin/tsc'))
})

t.test('resolve from current project if present, tsgo', async t => {
  t.chdir(
    t.testdir({
      'package.json': JSON.stringify({}),
      src: {},
      node_modules: {
        '.bin': {
          tsgo: t.fixture(
            'symlink',
            '../@typescript/native-preview/bin/tsgo.js',
          ),
        },
        '@typescript': {
          'native-preview': {
            bin: {
              'tsgo.js': 'imma typa go script compiler',
            },
            'package.json': JSON.stringify({
              bin: './bin/tsgo.js',
              exports: {
                './package.json': './package.json',
              },
            }),
          },
        },
      },
    }),
  )
  const { default: tsc } = await t.mockImport<
    typeof import('../src/which-tsc.js')
  >('../src/which-tsc.js', {
    '../src/config.js': { compiler: 'tsgo' },
  })
  t.equal(tsc, resolve(t.testdirName, 'node_modules/.bin/tsgo'))
})

t.test('resolve from here', async t => {
  const { default: tsc } = await t.mockImport<
    typeof import('../src/which-tsc.js')
  >('../src/which-tsc.js')
  t.equal(
    tsc,
    resolve(
      fileURLToPath(import.meta.url),
      '../../node_modules/.bin/tsgo',
    ),
  )
})
