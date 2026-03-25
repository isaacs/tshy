import type { Test } from 'tap'
import t from 'tap'
import type { Package } from '../src/types.js'
import { lstatSync } from 'node:fs'

t.test('linkedAlready=true in nm', async t => {
  const dir = t.testdir({
    node_modules: {
      notlink: {},
      name: t.fixture('symlink', '..'),
      '@scope': { name: t.fixture('symlink', '../..') },
    },
  })
  for (const [name, expect] of Object.entries({
    name: true,
    '@scope/name': true,
    'some other thing': false,
  })) {
    t.test(name, async t => {
      t.chdir(dir)
      const { linkedAlready } = await t.mockImport<
        typeof import('../src/self-link.js')
      >('../src/self-link.js')
      const pkg = { name } as unknown as Package
      t.equal(linkedAlready(pkg), expect)
      // double to verify memoizing
      t.equal(linkedAlready(pkg), expect)
    })
  }
  t.test('actually in the package also counts', async t => {
    t.chdir(dir + '/node_modules/notlink')
    const { linkedAlready } = await t.mockImport<
      typeof import('../src/self-link.js')
    >('../src/self-link.js')
    const pkg = { name: 'notlink' } as unknown as Package
    t.equal(linkedAlready(pkg), true)
    // double to verify memoizing
    t.equal(linkedAlready(pkg), true)
  })
})

t.test('link/unlink', async t => {
  t.test('skip cases', t => {
    const verifyNoLink = async (t: Test, pkg: Package) => {
      t.chdir(
        t.testdir({
          'package.json': JSON.stringify(pkg),
          dist: { esm: {} },
        }),
      )
      const { link, unlink } = await t.mockImport<
        typeof import('../src/self-link.js')
      >('../src/self-link.js')
      link(pkg, 'dist/esm')
      unlink(pkg, 'dist/esm')
      t.throws(
        () => lstatSync('dist/esm/node_modules/name'),
        'link not created',
      )
    }
    t.test('selfLink: false', t =>
      verifyNoLink(t, {
        name: 'name',
        tshy: { selfLink: false },
      } as Package),
    )
    t.test('no name', t =>
      verifyNoLink(t, { tshy: { selfLink: true } } as Package),
    )
    t.end()
  })

  t.test('linking', async t => {
    t.chdir(
      t.testdir({
        dist: { esm: {} },
      }),
    )
    const pkg: Package = { name: 'x', version: '1.2.3' }
    const { link, unlink } = await t.mockImport<
      typeof import('../src/self-link.js')
    >('../src/self-link.js')
    link(pkg, 'dist/esm')
    link(pkg, 'dist/esm')
    t.equal(lstatSync('dist/esm/node_modules/x').isSymbolicLink(), true)
    unlink(pkg, 'dist/esm')
    unlink(pkg, 'dist/esm')
    t.throws(() => lstatSync('dist/esm/node_modules/x'))
  })

  t.test('linking failure, best effort', async t => {
    t.chdir(
      t.testdir({
        dist: { esm: {} },
      }),
    )
    const pkg: Package = { name: 'x', version: '1.2.3' }
    const { link } = await t.mockImport<
      typeof import('../src/self-link.js')
    >('../src/self-link.js', {
      'node:fs': t.createMock(await import('node:fs'), {
        symlinkSync() {
          throw new Error('nolinky')
        },
      }),
    })
    link(pkg, 'dist/esm')
    link(pkg, 'dist/esm')
    t.throws(() => lstatSync('dist/esm/node_modules/x'))
  })
})
