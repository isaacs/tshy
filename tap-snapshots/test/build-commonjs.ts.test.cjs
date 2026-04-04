/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/build-commonjs.ts > TAP > basic commonjs build > output 1`] = `
Array [
  Array [
    "blah",
    Array [
      "blah-blah.cjs.map",
      "blah-blah.d.cts.map",
      "blah.d.ts",
      "blah.js",
      "index.d.ts",
      "index.d.ts.map",
      "index.js",
      "index.js.map",
    ],
  ],
  "blah-cjs.cjs.map",
  "blah-cjs.d.cts.map",
  "blah.d.ts",
  "blah.js",
  "index.d.ts",
  "index.d.ts.map",
  "index.js",
  "index.js.map",
  Array [
    "no-overrides",
    Array [
      "blah.d.ts",
      "blah.d.ts.map",
      "blah.js",
      "blah.js.map",
      "index.d.ts",
      "index.d.ts.map",
      "index.js",
      "index.js.map",
    ],
  ],
  "package.json",
]
`

exports[`test/build-commonjs.ts > TAP > basic commonjs build > spawnSync args 1`] = `
Array [
  Array [
    "{NODE}",
    Array [
      "{CWD}/node_modules/typescript/bin/tsc",
      "-p",
      ".tshy/commonjs.json",
    ],
    Object {
      "stdio": "inherit",
    },
  ],
  Array [
    "{NODE}",
    Array [
      "{CWD}/node_modules/typescript/bin/tsc",
      "-p",
      ".tshy/commonjs-blah.json",
    ],
    Object {
      "stdio": "inherit",
    },
  ],
  Array [
    "{NODE}",
    Array [
      "{CWD}/node_modules/typescript/bin/tsc",
      "-p",
      ".tshy/commonjs-no-overrides.json",
    ],
    Object {
      "stdio": "inherit",
    },
  ],
]
`

exports[`test/build-commonjs.ts > TAP > build failure > output 1`] = `
Array [
  "blah-cjs.cjs",
  "blah-cjs.cjs.map",
  "blah-cjs.d.cts",
  "blah-cjs.d.cts.map",
  "blah.d.ts",
  "blah.d.ts.map",
  "blah.js",
  "blah.js.map",
  "index.d.ts",
  "index.d.ts.map",
  "index.js",
  "index.js.map",
]
`

exports[`test/build-commonjs.ts > TAP > build failure > spawnSync args 1`] = `
Array [
  Array [
    "{NODE}",
    Array [
      "{CWD}/node_modules/typescript/bin/tsc",
      "-p",
      ".tshy/commonjs.json",
    ],
    Object {
      "stdio": "inherit",
    },
  ],
  Array [
    "{NODE}",
    Array [
      "{CWD}/node_modules/typescript/bin/tsc",
      "-p",
      ".tshy/commonjs-blah.json",
    ],
    Object {
      "stdio": "inherit",
    },
  ],
  Array [
    "{NODE}",
    Array [
      "{CWD}/node_modules/typescript/bin/tsc",
      "-p",
      ".tshy/commonjs-no-overrides.json",
    ],
    Object {
      "stdio": "inherit",
    },
  ],
  Array [
    "{NODE}",
    Array [
      "{CWD}/node_modules/typescript/bin/tsc",
      "-p",
      ".tshy/commonjs.json",
    ],
    Object {
      "stdio": "inherit",
    },
  ],
]
`
