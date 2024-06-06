import { statSync } from 'fs'
import t from 'tap'
import cleanBuildTmp from '../src/clean-build-tmp.js'
import readTypescriptConfig from '../src/read-typescript-config.js'

t.test('no incremental build, just delete it', t => {
  readTypescriptConfig().options.incremental = false
  t.chdir(
    t.testdir({
      '.tshy-build': {},
    })
  )
  cleanBuildTmp()
  t.throws(() => statSync('.tshy-build'))
  t.end()
})

t.test('no tsbuildinfo, just delete it', t => {
  readTypescriptConfig().options.incremental = true
  t.chdir(
    t.testdir({
      '.tshy-build': {},
    })
  )
  cleanBuildTmp()
  t.throws(() => statSync('.tshy-build'))
  t.end()
})

t.test('remove files not found in src', t => {
  readTypescriptConfig().options.incremental = true
  t.chdir(
    t.testdir({
      '.tshy-build': {
        '.tshy': { 'esm.tsbuildinfo': '{}' },
        esm: {
          'a.d.ts': '',
          'a.js': '',
          'a.js.map': '',
          'a.d.ts.map': '',
          'a.jsx': '',
          'a.jsx.map': '',
          dir: {
            'b.d.ts': '',
            'b.js': '',
            'b.js.map': '',
            'b.d.ts.map': '',
          },
          'x.d.ts': '',
          'x.js': '',
          'x.js.map': '',
          'x.d.ts.map': '',
          'm.mjs': '',
          'm.d.mts': '',
          'c.cjs': '',
          'c.d.cts': '',
          xdir: {
            'x.d.ts': '',
            'x.js': '',
            'x.js.map': '',
            'x.d.ts.map': '',
          },
        },
      },
      src: {
        'a.tsx': '',
        dir: {
          'b.ts': '',
        },
      },
    })
  )
  cleanBuildTmp()
  t.throws(() => statSync('.tshy-build/dist/esm/x.js.map'))
  t.throws(() => statSync('.tshy-build/dist/esm/x.d.ts'))
  t.end()
})
