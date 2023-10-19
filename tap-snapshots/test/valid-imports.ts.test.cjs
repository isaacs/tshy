/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/valid-imports.ts > TAP > {"pkg":{"imports":"asdf"}} > failure message 1`] = `
invalid imports object, must be Record<string, Import>, got: "asdf"
`

exports[`test/valid-imports.ts > TAP > {"pkg":{"imports":[]}} > failure message 1`] = `
invalid imports object, must be Record<string, Import>, got: []
`

exports[`test/valid-imports.ts > TAP > {"pkg":{"imports":{"#":"y"}}} > failure message 1`] = `
invalid imports module specifier: #
`

exports[`test/valid-imports.ts > TAP > {"pkg":{"imports":{"#x":["./src/x"]}}} > failure message 1`] = `
unbuilt package.imports #x must not be in ./src, and imports in ./src must be string values. got: ["./src/x"]
`

exports[`test/valid-imports.ts > TAP > {"pkg":{"imports":{"x":"y"}}} > failure message 1`] = `
invalid imports module specifier: x
`
