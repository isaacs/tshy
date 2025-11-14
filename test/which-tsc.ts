import t from 'tap'
import tsc from '../src/which-tsc.js'
import { accessSync, constants } from 'node:fs'
import { resolve } from 'node:path'

t.doesNotThrow(
  () => accessSync(tsc, constants.R_OK),
  'tsc is readable',
)

t.test('resolve from current project if present', async t => {
  t.chdir(
    t.testdir({
      node_modules: {
        typescript: {
          'package.json': JSON.stringify({ main: 'index.js' }),
          'index.js': 'console.log("hello i am a type a script")',
          bin: {
            tsc: 'imma typa script complier',
          },
        },
      },
    }),
  )
  const { default: tsc } = await t.mockImport<
    typeof import('../src/which-tsc.js')
  >('../src/which-tsc.js')
  t.equal(tsc, resolve(t.testdirName, 'node_modules/bin/tsc'))
})
