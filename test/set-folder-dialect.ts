import { readFileSync } from 'fs'
import {resolve} from 'path'
import t from 'tap'
import setFolderDialect from '../src/set-folder-dialect.js'

const dir = t.testdir()

const expect = (n?: string) => {
  if (!n) {
    t.throws(() => readFileSync(resolve(dir, 'package.json'), 'utf8'))
  } else {
    t.equal(readFileSync(resolve(dir, 'package.json'), 'utf8'), JSON.stringify({
      type: n
    }))
  }
}

setFolderDialect(dir, 'esm')
expect('module')
setFolderDialect(dir)
expect()
setFolderDialect(dir, 'commonjs')
expect('commonjs')
