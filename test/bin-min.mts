import t from 'tap'
// just empty for coverage
t.mockImport('../src/bin-min.mjs', {
  '../src/index.js': {},
})
t.pass('this is fine')
