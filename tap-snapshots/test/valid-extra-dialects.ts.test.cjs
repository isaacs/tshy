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
    "tshy.commonjsDialects must be an array of strings, got: 123",
  ],
]
`

exports[`test/valid-extra-dialects.ts > TAP > {"esmDialects":["blah"],"sourceDialects":["blah"]} > failure message 1`] = `
Array [
  Array [
    "tshy.esmDialects overlap with tshy.sourceDialects: blah",
  ],
]
`

exports[`test/valid-extra-dialects.ts > TAP > {"esmDialects":["cjs"]} > failure message 1`] = `
Array [
  Array [
    "tshy.esmDialects must not contain 'cjs'",
  ],
]
`

exports[`test/valid-extra-dialects.ts > TAP > {"esmDialects":["commonjs"]} > failure message 1`] = `
Array [
  Array [
    "tshy.esmDialects must not contain 'commonjs'",
  ],
]
`

exports[`test/valid-extra-dialects.ts > TAP > {"esmDialects":["default"]} > failure message 1`] = `
Array [
  Array [
    "tshy.esmDialects must not contain 'default'",
  ],
]
`

exports[`test/valid-extra-dialects.ts > TAP > {"esmDialects":["folderinsrc"],"commonjsDialects":["blah"]} > failure message 1`] = `
Array [
  Array [
    "tshy.esmDialects contains a src entry, not allowed: 'folderinsrc'",
  ],
]
`

exports[`test/valid-extra-dialects.ts > TAP > {"esmDialects":["import"]} > failure message 1`] = `
Array [
  Array [
    "tshy.esmDialects must not contain 'import'",
  ],
]
`

exports[`test/valid-extra-dialects.ts > TAP > {"esmDialects":["require"]} > failure message 1`] = `
Array [
  Array [
    "tshy.esmDialects must not contain 'require'",
  ],
]
`

exports[`test/valid-extra-dialects.ts > TAP > {"esmDialects":["source"]} > failure message 1`] = `
Array [
  Array [
    "tshy.esmDialects must not contain 'source'",
  ],
]
`

exports[`test/valid-extra-dialects.ts > TAP > {"esmDialects":["src/fileinsrc.ts"],"commonjsDialects":["blah"]} > failure message 1`] = `
Array [
  Array [
    "tshy.esmDialects entries may not contain slashes: 'src/fileinsrc.ts'",
  ],
]
`

exports[`test/valid-extra-dialects.ts > TAP > {"esmDialects":[123]} > failure message 1`] = `
Array [
  Array [
    "tshy.esmDialects must be an array of strings, got: 123",
  ],
]
`

exports[`test/valid-extra-dialects.ts > TAP > {"sourceDialects":["blah"],"commonjsDialects":["blah"]} > failure message 1`] = `
Array [
  Array [
    "tshy.commonjsDialects overlap with tshy.sourceDialects: blah",
  ],
]
`

exports[`test/valid-extra-dialects.ts > TAP > {"sourceDialects":["blah"],"esmDialects":["blah"]} > failure message 1`] = `
Array [
  Array [
    "tshy.esmDialects overlap with tshy.sourceDialects: blah",
  ],
]
`

exports[`test/valid-extra-dialects.ts > TAP > {"sourceDialects":["source"]} > failure message 1`] = `
Array [
  Array [
    "tshy.sourceDialects must not contain 'source'",
  ],
]
`
