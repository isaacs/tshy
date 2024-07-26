/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/self-dep.ts > TAP > link, but no dirs made > mkdirSyncs 1`] = `
Array [
  Array [
    "{CWD}/some/path/node_modules",
    Object {
      "recursive": true,
    },
  ],
]
`

exports[`test/self-dep.ts > TAP > link, but no dirs made > rmSyncs 1`] = `
Array [
  Array [
    "{CWD}/some/path/node_modules/name",
    Object {
      "force": true,
      "recursive": true,
    },
  ],
  Array [
    "{CWD}/some",
    Object {
      "force": true,
      "recursive": true,
    },
  ],
]
`

exports[`test/self-dep.ts > TAP > link, but no dirs made > symlinks 1`] = `
Array [
  Array [
    "../../..",
    "{CWD}/some/path/node_modules/name",
  ],
]
`

exports[`test/self-dep.ts > TAP > made dir, clean up > mkdirSyncs 1`] = `
Array [
  Array [
    "{CWD}/some/path/node_modules",
    Object {
      "recursive": true,
    },
  ],
]
`

exports[`test/self-dep.ts > TAP > made dir, clean up > rmSyncs 1`] = `
Array [
  Array [
    "{CWD}/some/path/node_modules/name",
    Object {
      "force": true,
      "recursive": true,
    },
  ],
  Array [
    "{CWD}/some",
    Object {
      "force": true,
      "recursive": true,
    },
  ],
]
`

exports[`test/self-dep.ts > TAP > made dir, clean up > symlinks 1`] = `
Array [
  Array [
    "../../..",
    "{CWD}/some/path/node_modules/name",
  ],
]
`

exports[`test/self-dep.ts > TAP > throw both times, but accept if best-effort > mkdirSyncs 1`] = `
Array [
  Array [
    "{CWD}/some/path/node_modules",
    Object {
      "recursive": true,
    },
  ],
]
`

exports[`test/self-dep.ts > TAP > throw both times, but accept if best-effort > rmSyncs 1`] = `
Array [
  Array [
    "{CWD}/some/path/node_modules/name",
    Object {
      "force": true,
      "recursive": true,
    },
  ],
]
`

exports[`test/self-dep.ts > TAP > throw both times, but accept if best-effort > symlinks 1`] = `
Array [
  Array [
    "../../..",
    "{CWD}/some/path/node_modules/name",
  ],
  Array [
    "../../..",
    "{CWD}/some/path/node_modules/name",
  ],
]
`

exports[`test/self-dep.ts > TAP > throw both times, but self-link is required > mkdirSyncs 1`] = `
Array [
  Array [
    "{CWD}/some/path/node_modules",
    Object {
      "recursive": true,
    },
  ],
]
`

exports[`test/self-dep.ts > TAP > throw both times, but self-link is required > rmSyncs 1`] = `
Array [
  Array [
    "{CWD}/some/path/node_modules/name",
    Object {
      "force": true,
      "recursive": true,
    },
  ],
]
`

exports[`test/self-dep.ts > TAP > throw both times, but self-link is required > symlinks 1`] = `
Array [
  Array [
    "../../..",
    "{CWD}/some/path/node_modules/name",
  ],
  Array [
    "../../..",
    "{CWD}/some/path/node_modules/name",
  ],
]
`

exports[`test/self-dep.ts > TAP > try one more time if it fails > mkdirSyncs 1`] = `
Array [
  Array [
    "{CWD}/some/path/node_modules",
    Object {
      "recursive": true,
    },
  ],
]
`

exports[`test/self-dep.ts > TAP > try one more time if it fails > rmSyncs 1`] = `
Array [
  Array [
    "{CWD}/some/path/node_modules/name",
    Object {
      "force": true,
      "recursive": true,
    },
  ],
]
`

exports[`test/self-dep.ts > TAP > try one more time if it fails > symlinks 1`] = `
Array [
  Array [
    "../../..",
    "{CWD}/some/path/node_modules/name",
  ],
  Array [
    "../../..",
    "{CWD}/some/path/node_modules/name",
  ],
]
`
