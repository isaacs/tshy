/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/watch.ts > TAP > build failure > errs after change 1`] = `
Array [
  Array [
    "/u001b[36m/u001b[2mchange/u001b[22m/u001b[39m",
    "{CWD}/.tap/fixtures/test-watch.ts-build-whenever-changes-happen/package.json",
  ],
  Array [
    "/u001b[36m/u001b[2mchange/u001b[22m/u001b[39m",
    "src/x.ts",
  ],
  Array [
    "/u001b[31mbuild failure/u001b[39m",
    Object {
      "code": 1,
      "signal": null,
    },
  ],
  Array [
    "/u001b[36m/u001b[2mchange/u001b[22m/u001b[39m",
    "src/x.ts",
  ],
  Array [
    "/u001b[31mbuild failure/u001b[39m",
    Object {
      "code": 1,
      "signal": null,
    },
  ],
]
`

exports[`test/watch.ts > TAP > build failure > errs before change 1`] = `
Array [
  Array [
    "/u001b[31mbuild failure/u001b[39m",
    Object {
      "code": 1,
      "signal": null,
    },
  ],
]
`

exports[`test/watch.ts > TAP > build failure > logs after change 1`] = `
Array []
`

exports[`test/watch.ts > TAP > build failure > logs before change 1`] = `
Array [
  Array [
    "/u001b[32mbuild success/u001b[39m",
    Object {
      "code": 0,
      "signal": null,
    },
  ],
]
`

exports[`test/watch.ts > TAP > build whenever changes happen > must match snapshot 1`] = `
Array [
  Array [
    "/u001b[32mbuild success/u001b[39m",
    Object {
      "code": 0,
      "signal": null,
    },
  ],
  Array [
    "/u001b[32mbuild success/u001b[39m",
    Object {
      "code": 0,
      "signal": null,
    },
  ],
]
`

exports[`test/watch.ts > TAP > build whenever changes happen > must match snapshot 2`] = `
Array []
`

exports[`test/watch.ts > TAP > must match snapshot 1`] = `
Object {
  "bin": "{CWD}/dist/esm/index.js",
  "options": Object {
    "ignored": Function ignored(path),
    "ignoreInitial": true,
    "ignorePermissionErrors": true,
    "persistent": true,
  },
  "rootPJ": "{CWD}/package.json",
  "src": "{CWD}/src",
  "srcNM": "{CWD}/src/node_modules",
  "srcPJ": "{CWD}/src/package.json",
  "targets": Array [
    "{CWD}/src",
    "{CWD}/package.json",
  ],
}
`
