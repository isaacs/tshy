import { posix as path, resolve } from 'node:path'
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

import * as FS from 'node:fs'
let symlinkThrow: Error | undefined = undefined
let symlinkThrowAgain: Error | undefined = undefined
const fs = {
  symlinkSync: () => {
    if (symlinkThrow) {
      try {
        throw symlinkThrow
      } finally {
        symlinkThrow = symlinkThrowAgain
        symlinkThrowAgain = undefined
      }
    }
  },
  readlinkSync: FS.readlinkSync,
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
  '../dist/esm/self-link.js',
  { mkdirp, fs, rimraf, path }
)) as typeof import('../dist/esm/self-link.js')

t.test('no pkg name, nothing to do', t => {
  link({} as Package, 'some/path')
  unlink({} as Package, 'some/path')
  t.strictSame(symlinkCalls(), [], 'no symlinks')
  t.strictSame(rimrafCalls(), [], 'no rimrafs')
  t.strictSame(mkdirpCalls(), [], 'no mkdirps')
  t.end()
})

t.test('no selfLink, nothing to do', t => {
  link(
    { name: 'name', tshy: { selfLink: false } } as Package,
    'some/path'
  )
  unlink(
    { name: 'name', tshy: { selfLink: false } } as Package,
    'some/path'
  )
  t.strictSame(symlinkCalls(), [], 'no symlinks')
  t.strictSame(rimrafCalls(), [], 'no rimrafs')
  t.strictSame(mkdirpCalls(), [], 'no mkdirps')
  t.end()
})

t.test('try one more time if it fails', t => {
  symlinkThrow = new Error('eexist')
  link({ name: 'name', version: '1.2.3' }, 'some/path')
  t.matchSnapshot(symlinkCalls(), 'symlinks')
  t.matchSnapshot(rimrafCalls(), 'rimrafs')
  t.matchSnapshot(mkdirpCalls(), 'mkdirps')
  t.end()
})

t.test('throw both times, but accept if best-effort', t => {
  symlinkThrow = new Error('EPERM')
  symlinkThrowAgain = new Error('EPERM')
  link({ name: 'name', version: '1.2.3' }, 'some/path')
  t.matchSnapshot(symlinkCalls(), 'symlinks')
  t.matchSnapshot(rimrafCalls(), 'rimrafs')
  t.matchSnapshot(mkdirpCalls(), 'mkdirps')
  t.end()
})

t.test('throw both times, but self-link is required', t => {
  symlinkThrow = new Error('EPERM')
  symlinkThrowAgain = new Error('EPERM')
  t.throws(() =>
    link(
      { name: 'name', version: '1.2.3', tshy: { selfLink: true } },
      'some/path'
    )
  )
  t.matchSnapshot(symlinkCalls(), 'symlinks')
  t.matchSnapshot(rimrafCalls(), 'rimrafs')
  t.matchSnapshot(mkdirpCalls(), 'mkdirps')
  t.end()
})

t.test('link, but no dirs made', t => {
  link({ name: 'name', version: '1.2.3' }, 'some/path')
  unlink({ name: 'name', version: '1.2.3' }, 'some/path')
  t.matchSnapshot(symlinkCalls(), 'symlinks')
  t.matchSnapshot(rimrafCalls(), 'rimrafs')
  t.matchSnapshot(mkdirpCalls(), 'mkdirps')
  t.end()
})

t.test('made dir, clean up', t => {
  mkdirpMade = 'some'
  link({ name: 'name', version: '1.2.3' }, 'some/path')
  unlink({ name: 'name', version: '1.2.3' }, 'some/path')
  t.matchSnapshot(symlinkCalls(), 'symlinks')
  t.matchSnapshot(rimrafCalls(), 'rimrafs')
  t.matchSnapshot(mkdirpCalls(), 'mkdirps')
  t.end()
})

t.test('already in node_modules, do not create link', t => {
  const readlinkCalls = t.capture(
    fs,
    'readlinkSync',
    fs.readlinkSync
  ).args

  const dir = t.testdir({
    node_modules: {
      installed: { src: {} },
      linked: t.fixture('symlink', '../packages/linked'),
      '@scope': {
        linked: t.fixture('symlink', '../../packages/scopelinked'),
        installed: { src: {} },
      },
    },
    packages: {
      linked: { src: {} },
      scopelinked: { src: {} },
    },
  })

  const cases: [string, string][] = [
    ['installed', 'node_modules/installed'],
    ['@scope/installed', 'node_modules/@scope/installed'],
    ['linked', 'node_modules/linked'],
    ['@scope/linked', 'node_modules/@scope/linked'],
    ['linked', 'packages/linked'],
    ['@scope/linked', 'packages/scopelinked'],
  ]

  t.plan(cases.length)

  for (const [name, d] of cases) {
    t.test(d, async t => {
      // need a separate import for each test, because this gets cached
      // to save extra readlink and walkUp calls.
      const { link, unlink } = (await t.mockImport(
        '../dist/esm/self-link.js',
        { mkdirp, fs, rimraf }
      )) as typeof import('../dist/esm/self-link.js')
      t.chdir(resolve(dir, d))
      link({ name, version: '1.2.3' }, 'src')
      unlink({ name, version: '1.2.3' }, 'src')
      const rl = readlinkCalls()
      if (name.endsWith('linked')) {
        t.strictSame(
          rl.pop(),
          [resolve(dir, 'node_modules', name)],
          'found link'
        )
      } else {
        t.strictSame(rl, [], 'did not need to check for links')
      }
      t.strictSame(symlinkCalls(), [])
      t.strictSame(mkdirpCalls(), [])
      t.strictSame(rimrafCalls(), [])
      t.end()
    })
  }
})
