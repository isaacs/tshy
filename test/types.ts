import t from 'tap'
// just here for the coverage, to verify that nothing is there
await t.mockImport('../dist/esm/types.js')
t.pass('this is fine')
