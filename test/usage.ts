import t from 'tap'

import fail from '../dist/esm/fail.js'

const { default: link } = (await t.mockImport(
  '../dist/esm/usage.js',
  {
    chalk: { default: { level: 3, red: { bold: (s: string) => s } } },
    '../dist/esm/fail.js': fail,
  }
)) as typeof import('../dist/esm/usage.js')
const { default: noLink } = (await t.mockImport(
  '../dist/esm/usage.js',
  {
    chalk: { default: { level: 0, red: { bold: (s: string) => s } } },
    '../dist/esm/fail.js': fail,
  }
)) as typeof import('../dist/esm/usage.js')

const exits = t.capture(process, 'exit').args
const errs = t.capture(console, 'error').args
const logs = t.capture(console, 'log').args

t.test('no error', async t => {
  t.test('with link', async t => {
    link()
    t.strictSame(errs(), [])
    t.strictSame(exits(), [[0]])
    t.matchSnapshot(
      logs()
        .map(s => s.join(''))
        .join('\n')
    )
  })
  t.test('no link', async t => {
    noLink()
    t.strictSame(errs(), [])
    t.strictSame(exits(), [[0]])
    t.matchSnapshot(
      logs()
        .map(s => s.join(''))
        .join('\n')
    )
  })
})

t.test('with error', async t => {
  t.test('with link', async t => {
    link('error string')
    t.strictSame(logs(), [])
    t.strictSame(exits(), [[1]])
    t.matchSnapshot(
      errs()
        .map(s => s.join(''))
        .join('\n')
    )
  })
  t.test('no link', async t => {
    noLink('error string')
    t.strictSame(logs(), [])
    t.strictSame(exits(), [[1]])
    t.matchSnapshot(
      errs()
        .map(s => s.join(''))
        .join('\n')
    )
  })
})
