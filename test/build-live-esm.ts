import { readdirSync } from 'fs'
import t from 'tap'

type Out = string | Out[]
const output = (dir = '.tshy-build/esm'): Out[] => {
  return readdirSync(dir, { withFileTypes: true })
    .sort(({ name: a }, { name: b }) => a.localeCompare(b, 'en'))
    .map(
      (f): Out =>
        f.isDirectory() ? [f.name, output(`${dir}/${f.name}`)] : f.name,
    )
}

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
    }),
  )
  const { buildLiveESM } = await t.mockImport<
    typeof import('../src/build-live-esm.js')
  >('../src/build-live-esm.js')
  buildLiveESM()
  t.matchSnapshot(output())
})
