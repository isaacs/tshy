import t from 'tap'
process.env.FORCE_COLOR = '0'
const mockConsole = {
  log: () => {},
  debug: () => {},
}
const logs = t.capture(mockConsole, 'log').args
const debug = t.capture(mockConsole, 'debug').args

let buildCalled = false
await t.mockImport('../dist/esm/index.js', {
  '../dist/esm/console.js': mockConsole,
  '../dist/esm/build.js': () => (buildCalled = true),
})
t.equal(buildCalled, true)
t.match(debug(), [
  ['building', process.cwd()],
  ['tshy config', Object],
  ['exports', Object],
])
t.strictSame(logs(), [['success!']])
