/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/exports.ts > TAP > extra dialects > commonjs > extras=false > must match snapshot 1`] = `
Object {
  ".": Object {
    "require": Object {
      "types": "./dist/commonjs/index.d.ts",
      "default": "./dist/commonjs/index.js",
    },
  },
  "./foo": Object {
    "require": Object {
      "types": "./dist/commonjs/foo.d.ts",
      "default": "./dist/commonjs/foo.js",
    },
  },
}
`

exports[`test/exports.ts > TAP > extra dialects > commonjs > extras=true > must match snapshot 1`] = `
Object {
  ".": Object {
    "blah": Object {
      "types": "./dist/blah/index.d.ts",
      "default": "./dist/blah/index.js",
    },
    "require": Object {
      "types": "./dist/commonjs/index.d.ts",
      "default": "./dist/commonjs/index.js",
    },
  },
  "./foo": Object {
    "blah": Object {
      "types": "./dist/blah/foo.d.ts",
      "default": "./dist/blah/foo.js",
    },
    "require": Object {
      "types": "./dist/commonjs/foo.d.ts",
      "default": "./dist/commonjs/foo.js",
    },
  },
}
`

exports[`test/exports.ts > TAP > extra dialects > esm > extras=false > must match snapshot 1`] = `
Object {
  ".": Object {
    "import": Object {
      "types": "./dist/esm/index.d.ts",
      "default": "./dist/esm/index.js",
    },
  },
  "./foo": Object {
    "import": Object {
      "types": "./dist/esm/foo.d.ts",
      "default": "./dist/esm/foo.js",
    },
  },
}
`

exports[`test/exports.ts > TAP > extra dialects > esm > extras=true > must match snapshot 1`] = `
Object {
  ".": Object {
    "deno": Object {
      "types": "./dist/deno/index.d.ts",
      "default": "./dist/deno/index.js",
    },
    "no-overrides": Object {
      "types": "./dist/no-overrides/index.d.ts",
      "default": "./dist/no-overrides/index.js",
    },
    "import": Object {
      "types": "./dist/esm/index.d.ts",
      "default": "./dist/esm/index.js",
    },
  },
  "./foo": Object {
    "deno": Object {
      "types": "./dist/deno/foo.d.ts",
      "default": "./dist/deno/foo.js",
    },
    "no-overrides": Object {
      "types": "./dist/no-overrides/foo.d.ts",
      "default": "./dist/no-overrides/foo.js",
    },
    "import": Object {
      "types": "./dist/esm/foo.d.ts",
      "default": "./dist/esm/foo.js",
    },
  },
}
`

exports[`test/exports.ts > TAP > extra dialects > undefined > extras=false > must match snapshot 1`] = `
Object {
  ".": Object {
    "import": Object {
      "types": "./dist/esm/index.d.ts",
      "default": "./dist/esm/index.js",
    },
    "require": Object {
      "types": "./dist/commonjs/index.d.ts",
      "default": "./dist/commonjs/index.js",
    },
  },
  "./foo": Object {
    "import": Object {
      "types": "./dist/esm/foo.d.ts",
      "default": "./dist/esm/foo.js",
    },
    "require": Object {
      "types": "./dist/commonjs/foo.d.ts",
      "default": "./dist/commonjs/foo.js",
    },
  },
}
`

exports[`test/exports.ts > TAP > extra dialects > undefined > extras=true > must match snapshot 1`] = `
Object {
  ".": Object {
    "deno": Object {
      "types": "./dist/deno/index.d.ts",
      "default": "./dist/deno/index.js",
    },
    "no-overrides": Object {
      "types": "./dist/no-overrides/index.d.ts",
      "default": "./dist/no-overrides/index.js",
    },
    "blah": Object {
      "types": "./dist/blah/index.d.ts",
      "default": "./dist/blah/index.js",
    },
    "import": Object {
      "types": "./dist/esm/index.d.ts",
      "default": "./dist/esm/index.js",
    },
    "require": Object {
      "types": "./dist/commonjs/index.d.ts",
      "default": "./dist/commonjs/index.js",
    },
  },
  "./foo": Object {
    "deno": Object {
      "types": "./dist/deno/foo.d.ts",
      "default": "./dist/deno/foo.js",
    },
    "no-overrides": Object {
      "types": "./dist/no-overrides/foo.d.ts",
      "default": "./dist/no-overrides/foo.js",
    },
    "blah": Object {
      "types": "./dist/blah/foo.d.ts",
      "default": "./dist/blah/foo.js",
    },
    "import": Object {
      "types": "./dist/esm/foo.d.ts",
      "default": "./dist/esm/foo.js",
    },
    "require": Object {
      "types": "./dist/commonjs/foo.d.ts",
      "default": "./dist/commonjs/foo.js",
    },
  },
}
`

exports[`test/exports.ts > TAP > setting top level main > invalid main commonjs, no exports > must match snapshot 1`] = `
Array [
  Array [
    "could not resolve exports['.'] for tshy.main 'require'",
  ],
]
`

exports[`test/exports.ts > TAP > setting top level main > main explicit true, no commonjs module > must match snapshot 1`] = `
Array [
  Array [
    "could not resolve exports['.'] for tshy.main 'require'",
  ],
]
`
