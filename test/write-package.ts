import { readFileSync } from 'fs'
import { resolve } from 'path'
import t from 'tap'

t.chdir(t.testdir({}))
const { default: writePackage } = (await t.mockImport(
  '../dist/esm/write-package.js',
  {
    '../dist/esm/package.js': {
      default: {
        name: 'some package',
      },
    },
  }
)) as typeof import('../dist/esm/write-package.js')

writePackage()
t.strictSame(
  JSON.parse(
    readFileSync(resolve(t.testdirName, 'package.json'), 'utf8')
  ),
  { name: 'some package' }
)
