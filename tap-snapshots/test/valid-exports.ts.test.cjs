/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/valid-exports.ts > TAP > [] false > exits 1`] = `
[]
`

exports[`test/valid-exports.ts > TAP > [] false > message 1`] = `
undefined
`

exports[`test/valid-exports.ts > TAP > {"./b":"./src/blah.ts"} true > export result 1`] = `
Object {
  "./b": "./src/blah.ts",
}
`

exports[`test/valid-exports.ts > TAP > {"./b":"src/b.ts"} true > export result 1`] = `
Object {
  "./b": "./src/b.ts",
}
`

exports[`test/valid-exports.ts > TAP > {"./b":{"require":"./blah.js"}} true > export result 1`] = `
Object {
  "./b": Object {
    "require": "./blah.js",
  },
}
`

exports[`test/valid-exports.ts > TAP > {"./b":{"require":"./src/blah.ts"}} false > exits 1`] = `
[[1]]
`

exports[`test/valid-exports.ts > TAP > {"./b":{"require":"./src/blah.ts"}} false > message 1`] = `
tshy.exports ./b unbuilt exports must not be in ./src, and exports in src must be string values. got: {"require":"./src/blah.ts"}
`

exports[`test/valid-exports.ts > TAP > {"./B":8} false > exits 1`] = `
[[1]]
`

exports[`test/valid-exports.ts > TAP > {"./B":8} false > message 1`] = `
tshy.exports ./B value must be valid package.json exports value, got: 8
`

exports[`test/valid-exports.ts > TAP > {"x":"./src/x.ts"} false > exits 1`] = `
[[1]]
`

exports[`test/valid-exports.ts > TAP > {"x":"./src/x.ts"} false > message 1`] = `
tshy.exports key must be "." or start with "./", got: x
`

exports[`test/valid-exports.ts > TAP > false false > exits 1`] = `
[]
`

exports[`test/valid-exports.ts > TAP > false false > message 1`] = `
undefined
`

exports[`test/valid-exports.ts > TAP > null false > exits 1`] = `
[]
`

exports[`test/valid-exports.ts > TAP > null false > message 1`] = `
undefined
`
