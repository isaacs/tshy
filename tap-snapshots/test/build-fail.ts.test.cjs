/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/build-fail.ts > TAP > must match snapshot 1`] = `
Array [
  Array [
    "setFolderDialect",
    Array [
      "src",
    ],
  ],
  Array [
    "unlinkImports",
    Array [
      Object {
        "name": "package",
      },
      "src",
    ],
  ],
  Array [
    "unlinkSelfDep",
    Array [
      Object {
        "name": "package",
      },
      "src",
    ],
  ],
  Array [
    "fail",
    Array [
      "build failed",
    ],
  ],
  Array [
    "console.error",
    Array [
      Object {
        "code": 0,
        "signal": "testing",
      },
    ],
  ],
  Array [
    "process.exit",
    Array [
      1,
    ],
  ],
]
`
