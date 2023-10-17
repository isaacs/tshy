/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/valid-imports.ts > TAP > {"config":{"imports":"asdf"},"pkg":{}} > failure message 1`] = `
tshy.imports must be an object if specified
`

exports[`test/valid-imports.ts > TAP > {"config":{"imports":[]},"pkg":{}} > failure message 1`] = `
tshy.imports must be an object if specified
`

exports[`test/valid-imports.ts > TAP > {"config":{"imports":{"#":"y"}},"pkg":{}} > failure message 1`] = `
invalid tshy.imports module specifier: #
`

exports[`test/valid-imports.ts > TAP > {"config":{"imports":{"#x":"./src/x"}},"pkg":{"imports":{"#x":{}}}} > failure message 1`] = `
tshy.imports keys must not appear in top-level imports, found in both: "#x"
`

exports[`test/valid-imports.ts > TAP > {"config":{"imports":{"#x":"y"}},"pkg":{}} > failure message 1`] = `
tshy.imports values must start with "./src/", got: "y"
`

exports[`test/valid-imports.ts > TAP > {"config":{"imports":{"#x":{}}},"pkg":{}} > failure message 1`] = `
tshy.imports values must start with "./src/", got: {}
`

exports[`test/valid-imports.ts > TAP > {"config":{"imports":{"x":"y"}},"pkg":{}} > failure message 1`] = `
invalid tshy.imports module specifier: x
`
