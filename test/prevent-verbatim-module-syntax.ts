import chalk from 'chalk'
import t from 'tap'
import readTypescriptConfig from '../src/read-typescript-config.js'
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

t.test('is set, many worries', t => {
  readTypescriptConfig().options.verbatimModuleSyntax = true
  preventVerbatimModuleSyntax()
  t.strictSame(exits(), [[1]])
  t.matchSnapshot(
    errs()
      .map(s => s.join(''))
      .join('\n')
  )
  t.strictSame(logs(), [])
  t.end()
})
