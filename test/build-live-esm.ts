import { readdirSync } from 'fs'
import t from 'tap'

const output = () =>
  readdirSync('.tshy-build/esm').sort((a, b) =>
    a.localeCompare(b, 'en')
  )

t.test('esm live dev build', async t => {
  t.chdir(
    t.testdir({
      'package.json': JSON.stringify({
        tshy: {
          esmDialects: ['blah', 'no-overrides'],
          exports: {
            '.': './src/index.ts',
            './blah': './src/blah.ts',
          },
        },
      }),
      src: {
        'index.ts': '',
        'blah.ts': '',
        'blah-blah.mts': '',
        'blah-cjs.cts': '',
      },
    })
  )
  const { buildLiveESM } = await t.mockImport<
    typeof import('../src/build-live-esm.js')
  >('../src/build-live-esm.js')
  buildLiveESM()
  t.matchSnapshot(output())
})
