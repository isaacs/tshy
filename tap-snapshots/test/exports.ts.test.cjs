/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/exports.ts > TAP > setting top level main > invalid main commonjs > must match snapshot 1`] = `
Array [
  Array [
    "could not resolve exports['.'] for tshy.main 'require'",
  ],
]
`

exports[`test/exports.ts > TAP > setting top level main > invalid main commonjs, no exports > must match snapshot 1`] = `
Array [
  Array [
    "could not resolve exports['.'] for tshy.main 'require'",
  ],
]
`

exports[`test/exports.ts > TAP > setting top level main > invalid main esm > must match snapshot 1`] = `
Array [
  Array [
    "could not resolve exports['.'] for tshy.main 'import'",
  ],
]
`

exports[`test/exports.ts > TAP > setting top level main > invalid main esm, no exports > must match snapshot 1`] = `
Array [
  Array [
    "could not resolve exports['.'] for tshy.main 'import'",
  ],
]
`

exports[`test/exports.ts > TAP > setting top level main > invalid main=blah > must match snapshot 1`] = `
Array [
  Array [
    "config.main must be 'commonjs' or 'esm', got: blah",
  ],
]
`

exports[`test/exports.ts > TAP > setting top level main > invalid main=false > must match snapshot 1`] = `
Array [
  Array [
    "config.main must be 'commonjs' or 'esm', got: false",
  ],
]
`
