import { posix as path } from 'node:path'
import t from 'tap'
import { Package } from '../src/types.js'

let mkdirpMade: undefined | string = undefined
const mkdirp = {
  mkdirpSync: () => mkdirpMade,
}
const mkdirpCalls = t.capture(
  mkdirp,
  'mkdirpSync',
  mkdirp.mkdirpSync
).args

const fs = {
  symlinkSync: () => {},
}
const symlinkCalls = t.capture(fs, 'symlinkSync', fs.symlinkSync).args

const rimraf = {
  rimrafSync: () => {},
}
const rimrafCalls = t.capture(
  rimraf,
  'rimrafSync',
  rimraf.rimrafSync
).args

const { link, unlink } = (await t.mockImport(
  '../dist/esm/self-dep.js',
  { mkdirp, fs, rimraf, path }
)) as typeof import('../dist/esm/self-dep.js')

t.test('no pkg name, nothing to do', t => {
  link({} as unknown as Package, 'some/path')
  unlink({} as unknown as Package, 'some/path')
  t.strictSame(symlinkCalls(), [], 'no symlinks')
  t.strictSame(rimrafCalls(), [], 'no rimrafs')
  t.strictSame(mkdirpCalls(), [], 'no mkdirps')
  t.end()
})

t.test('link, but no dirs made', t => {
  link({ name: 'name' } as unknown as Package, 'some/path')
  unlink({ name: 'name' } as unknown as Package, 'some/path')
  t.matchSnapshot(symlinkCalls(), 'symlinks')
  t.matchSnapshot(rimrafCalls(), 'rimrafs')
  t.matchSnapshot(mkdirpCalls(), 'mkdirps')
  t.end()
})

t.test('made dir, clean up', t => {
  mkdirpMade = 'some'
  link({ name: 'name' } as unknown as Package, 'some/path')
  unlink({ name: 'name' } as unknown as Package, 'some/path')
  t.matchSnapshot(symlinkCalls(), 'symlinks')
  t.matchSnapshot(rimrafCalls(), 'rimrafs')
  t.matchSnapshot(mkdirpCalls(), 'mkdirps')
  t.end()
})
