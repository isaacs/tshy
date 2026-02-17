import t from 'tap'
import readTypescriptConfig from '../src/read-typescript-config.js'

const config = readTypescriptConfig()
t.equal(config, readTypescriptConfig(), 'cached')

t.test('fail to look up config file', async t => {
  for (const badpath of ['./notexist.json', 'notexist.json']) {
    t.test(badpath, async t => {
      const dir = t.testdir({
        'tsconfig.json': JSON.stringify({
          extends: badpath,
        }),
      })
      t.chdir(dir)
      const { default: readTypescriptConfig } = await t.mockImport<
        typeof import('../src/read-typescript-config.js')
      >('../src/read-typescript-config.js')
      t.throws(() => readTypescriptConfig())
    })
  }
})

t.test('invalid data', async t => {
  const dir = t.testdir({
    'tsconfig.json': JSON.stringify(['this is not valid']),
  })
  t.chdir(dir)
  const { default: readTypescriptConfig } = await t.mockImport<
    typeof import('../src/read-typescript-config.js')
  >('../src/read-typescript-config.js')
  t.throws(() => readTypescriptConfig())
})

t.test('project extended configs', async t => {
  const dir = t.testdir({
    'tsconfig.json': JSON.stringify({
      extends: 'config.json',
    }),
    'config.json': JSON.stringify({
      extends: 'config/tsconfig.json',
    }),
    node_modules: {
      '@scope': {
        config: {
          'base.json': `
          {
            "extends": "./tsconfig",
            // this file has some comments
            "compilerOptions": {
              "newobject": {},
              "nestedObject": { "a": 100, "b": 200, "c": 200, },
              "fromBase": /* a comment here?
                across multiple lines
                so much to say!
              */ true,
              // this get overridden
              "fromPkg": false
            }
          }
          `,
          'tsconfig.json': JSON.stringify({
            extends: '@scope/config/base',
            compilerOptions: {
              nestedObject: { a: 1000, b: 2000, d: 3000 },
              overriddenObject: { deleteme: true },
              fromPkg: true,
            },
          }),
        },
      },
      config: {
        'tsconfig.json': JSON.stringify({
          // tsconfig.json filename is inferred
          extends: '@scope/config',
          compilerOptions: {
            nestedObject: { a: 1, b: 2 },
            overriddenObject: false,
          },
        }),
      },
    },
  })
  t.chdir(dir)
  const { default: readTypescriptConfig } = await t.mockImport<
    typeof import('../src/read-typescript-config.js')
  >('../src/read-typescript-config.js')
  t.strictSame(readTypescriptConfig(), {
    extends: 'config.json',
    compilerOptions: {
      newobject: {},
      nestedObject: { a: 1, b: 2, d: 3000, c: 200 },
      overriddenObject: false,
      fromPkg: true,
      fromBase: true,
    },
  })
  t.end()
})
