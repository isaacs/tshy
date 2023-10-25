import chalk from 'chalk'
import t from 'tap'
import preventVerbatimModuleSyntax from '../src/prevent-verbatim-module-syntax.js'

chalk.level = 3

const exits = t.capture(process, 'exit').args
const errs = t.capture(console, 'error').args
const logs = t.capture(console, 'log').args

t.test('not set, no worries', t => {
  preventVerbatimModuleSyntax()
  t.strictSame(exits(), [])
  t.strictSame(errs(), [])
  t.strictSame(logs(), [])
  t.end()
})

t.test('not set, no worries', t => {
  const cwd = process.cwd()
  process.chdir(
    t.testdir({
      'tsconfig.json': JSON.stringify({
        compilerOptions: {
          verbatimModuleSyntax: true,
        },
      }),
    })
  )
  preventVerbatimModuleSyntax()
  t.strictSame(exits(), [[1]])
  t.matchSnapshot(
    errs()
      .map(s => s.join(''))
      .join('\n')
  )
  t.strictSame(logs(), [])
  process.chdir(cwd)
  t.end()
})
