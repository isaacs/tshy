import { readdirSync } from 'fs'
import t from 'tap'

type Out = string | Out[]
const output = (dir = '.tshy-build/commonjs'): Out[] => {
  return readdirSync(dir, { withFileTypes: true })
    .sort(({ name: a }, { name: b }) => a.localeCompare(b, 'en'))
    .map(
      (f): Out =>
        f.isDirectory() ? [f.name, output(`${dir}/${f.name}`)] : f.name,
    )
}

t.test('commonjs live dev build', async t => {
  t.chdir(
    t.testdir({
      'package.json': JSON.stringify({
        tshy: {
          commonjsDialects: ['blah', 'no-overrides'],
          exports: {
            '.': './src/index.ts',
            './blah': './src/blah.ts',
          },
        },
      }),
      src: {
        'index.ts': 'console.log("hello")',
        'blah.ts': '',
        'blah-blah.cts': '',
        'blah-cjs.cts': '',
      },
    }),
  )
  const { buildLiveCommonJS } = await t.mockImport<
    typeof import('../src/build-live-commonjs.js')
  >('../src/build-live-commonjs.js')
  buildLiveCommonJS()
  t.matchSnapshot(output())
})
