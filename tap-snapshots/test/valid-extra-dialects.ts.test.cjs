/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/valid-extra-dialects.ts > TAP > {"commonjsDialects":[123]} > failure message 1`] = `
Array [
  Array [
    "commonjs must be an array of strings, got: 123",
  ],
]
`

exports[`test/valid-extra-dialects.ts > TAP > {"esmDialects":["blah"],"commonjsDialects":["blah"]} > failure message 1`] = `
Array [
  Array [
    "commonjsDialects and esmDialects must be unique, found blah in both lists",
  ],
]
`

exports[`test/valid-extra-dialects.ts > TAP > {"esmDialects":["cjs"]} > failure message 1`] = `
Array [
  Array [
    "esm must not contain cjs",
  ],
]
`

exports[`test/valid-extra-dialects.ts > TAP > {"esmDialects":["commonjs"]} > failure message 1`] = `
Array [
  Array [
    "esm must not contain commonjs",
  ],
]
`

exports[`test/valid-extra-dialects.ts > TAP > {"esmDialects":["default"]} > failure message 1`] = `
Array [
  Array [
    "esm must not contain default",
  ],
]
`

exports[`test/valid-extra-dialects.ts > TAP > {"esmDialects":["import"]} > failure message 1`] = `
Array [
  Array [
    "esm must not contain import",
  ],
]
`

exports[`test/valid-extra-dialects.ts > TAP > {"esmDialects":["node"]} > failure message 1`] = `
Array [
  Array [
    "esm must not contain node",
  ],
]
`

exports[`test/valid-extra-dialects.ts > TAP > {"esmDialects":["require"]} > failure message 1`] = `
Array [
  Array [
    "esm must not contain require",
  ],
]
`

exports[`test/valid-extra-dialects.ts > TAP > {"esmDialects":[123]} > failure message 1`] = `
Array [
  Array [
    "esm must be an array of strings, got: 123",
  ],
]
`
