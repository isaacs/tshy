import { readFileSync } from 'fs'
import { resolve } from 'path'
import t from 'tap'
import setFolderDialect from '../src/set-folder-dialect.js'

const dir = t.testdir()

const expect = (n?: string) => {
  if (!n) {
    t.throws(() => readFileSync(resolve(dir, 'package.json'), 'utf8'))
  } else {
    const expect = JSON.stringify({ type: n }, null, 2) + '\n'
    const actual = readFileSync(resolve(dir, 'package.json'), 'utf8')
    t.equal(actual, expect)
  }
}

setFolderDialect(dir, 'esm')
expect('module')
setFolderDialect(dir)
expect()
setFolderDialect(dir, 'commonjs')
expect('commonjs')
