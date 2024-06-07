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
      "source": "./src/index.ts",
      "default": "./dist/commonjs/index.js",
    },
  },
  "./foo": Object {
    "require": Object {
      "types": "./dist/commonjs/foo.d.ts",
      "source": "./src/foo.ts",
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
      "source": "./src/index.ts",
      "default": "./dist/blah/index.js",
    },
    "require": Object {
      "types": "./dist/commonjs/index.d.ts",
      "source": "./src/index.ts",
      "default": "./dist/commonjs/index.js",
    },
  },
  "./foo": Object {
    "blah": Object {
      "types": "./dist/blah/foo.d.ts",
      "source": "./src/foo.ts",
      "default": "./dist/blah/foo.js",
    },
    "require": Object {
      "types": "./dist/commonjs/foo.d.ts",
      "source": "./src/foo.ts",
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
      "source": "./src/index.ts",
      "default": "./dist/esm/index.js",
    },
  },
  "./foo": Object {
    "import": Object {
      "types": "./dist/esm/foo.d.ts",
      "source": "./src/foo.ts",
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
      "source": "./src/index.ts",
      "default": "./dist/deno/index.js",
    },
    "no-overrides": Object {
      "types": "./dist/no-overrides/index.d.ts",
      "source": "./src/index.ts",
      "default": "./dist/no-overrides/index.js",
    },
    "import": Object {
      "types": "./dist/esm/index.d.ts",
      "source": "./src/index.ts",
      "default": "./dist/esm/index.js",
    },
  },
  "./foo": Object {
    "deno": Object {
      "types": "./dist/deno/foo.d.ts",
      "source": "./src/foo.ts",
      "default": "./dist/deno/foo.js",
    },
    "no-overrides": Object {
      "types": "./dist/no-overrides/foo.d.ts",
      "source": "./src/foo.ts",
      "default": "./dist/no-overrides/foo.js",
    },
    "import": Object {
      "types": "./dist/esm/foo.d.ts",
      "source": "./src/foo.ts",
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
      "source": "./src/index.ts",
      "default": "./dist/esm/index.js",
    },
    "require": Object {
      "types": "./dist/commonjs/index.d.ts",
      "source": "./src/index.ts",
      "default": "./dist/commonjs/index.js",
    },
  },
  "./foo": Object {
    "import": Object {
      "types": "./dist/esm/foo.d.ts",
      "source": "./src/foo.ts",
      "default": "./dist/esm/foo.js",
    },
    "require": Object {
      "types": "./dist/commonjs/foo.d.ts",
      "source": "./src/foo.ts",
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
      "source": "./src/index.ts",
      "default": "./dist/deno/index.js",
    },
    "no-overrides": Object {
      "types": "./dist/no-overrides/index.d.ts",
      "source": "./src/index.ts",
      "default": "./dist/no-overrides/index.js",
    },
    "blah": Object {
      "types": "./dist/blah/index.d.ts",
      "source": "./src/index.ts",
      "default": "./dist/blah/index.js",
    },
    "import": Object {
      "types": "./dist/esm/index.d.ts",
      "source": "./src/index.ts",
      "default": "./dist/esm/index.js",
    },
    "require": Object {
      "types": "./dist/commonjs/index.d.ts",
      "source": "./src/index.ts",
      "default": "./dist/commonjs/index.js",
    },
  },
  "./foo": Object {
    "deno": Object {
      "types": "./dist/deno/foo.d.ts",
      "source": "./src/foo.ts",
      "default": "./dist/deno/foo.js",
    },
    "no-overrides": Object {
      "types": "./dist/no-overrides/foo.d.ts",
      "source": "./src/foo.ts",
      "default": "./dist/no-overrides/foo.js",
    },
    "blah": Object {
      "types": "./dist/blah/foo.d.ts",
      "source": "./src/foo.ts",
      "default": "./dist/blah/foo.js",
    },
    "import": Object {
      "types": "./dist/esm/foo.d.ts",
      "source": "./src/foo.ts",
      "default": "./dist/esm/foo.js",
    },
    "require": Object {
      "types": "./dist/commonjs/foo.d.ts",
      "source": "./src/foo.ts",
      "default": "./dist/commonjs/foo.js",
    },
  },
}
`

exports[`test/exports.ts > TAP > liveDev > no envs > must match snapshot 1`] = `
Object {
  ".": Object {
    "deno": Object {
      "source": "./src/index.ts",
      "default": "./dist/deno/index.ts",
    },
    "blah": Object {
      "source": "./src/index.ts",
      "default": "./dist/blah/index.ts",
    },
    "import": Object {
      "source": "./src/index.ts",
      "default": "./dist/esm/index.ts",
    },
    "require": Object {
      "source": "./src/index.ts",
      "default": "./dist/commonjs/index.ts",
    },
  },
  "./package.json": "./package.json",
  "./foo": Object {
    "deno": Object {
      "source": "./src/foo.mts",
      "default": "./dist/deno/foo.mts",
    },
    "import": Object {
      "source": "./src/foo.mts",
      "default": "./dist/esm/foo.mts",
    },
  },
  "./foo-cjs": Object {
    "blah": Object {
      "source": "./src/foo.cts",
      "default": "./dist/blah/foo.cts",
    },
    "require": Object {
      "source": "./src/foo.cts",
      "default": "./dist/commonjs/foo.cts",
    },
  },
  "./fill": Object {
    "deno": Object {
      "source": "./src/fill.ts",
      "default": "./dist/deno/fill.ts",
    },
    "blah": Object {
      "source": "./src/fill.ts",
      "default": "./dist/blah/fill.ts",
    },
    "import": Object {
      "source": "./src/fill.ts",
      "default": "./dist/esm/fill.ts",
    },
    "require": Object {
      "source": "./src/fill.ts",
      "default": "./dist/commonjs/fill.ts",
    },
  },
}
`

exports[`test/exports.ts > TAP > liveDev > pack > must match snapshot 1`] = `
Object {
  ".": Object {
    "deno": Object {
      "types": "./dist/deno/index.d.ts",
      "source": "./src/index.ts",
      "default": "./dist/deno/index.js",
    },
    "blah": Object {
      "types": "./dist/blah/index.d.ts",
      "source": "./src/index.ts",
      "default": "./dist/blah/index.js",
    },
    "import": Object {
      "types": "./dist/esm/index.d.ts",
      "source": "./src/index.ts",
      "default": "./dist/esm/index.js",
    },
    "require": Object {
      "types": "./dist/commonjs/index.d.ts",
      "source": "./src/index.ts",
      "default": "./dist/commonjs/index.js",
    },
  },
  "./package.json": "./package.json",
  "./foo": Object {
    "deno": Object {
      "types": "./dist/deno/foo.mjs",
      "source": "./src/foo.mts",
      "default": "./dist/deno/foo.mjs",
    },
    "import": Object {
      "types": "./dist/esm/foo.d.mts",
      "source": "./src/foo.mts",
      "default": "./dist/esm/foo.mjs",
    },
  },
  "./foo-cjs": Object {
    "blah": Object {
      "types": "./dist/blah/foo.cjs",
      "source": "./src/foo.cts",
      "default": "./dist/blah/foo.cjs",
    },
    "require": Object {
      "types": "./dist/commonjs/foo.d.cts",
      "source": "./src/foo.cts",
      "default": "./dist/commonjs/foo.cjs",
    },
  },
  "./fill": Object {
    "deno": Object {
      "types": "./dist/deno/fill.d.ts",
      "source": "./src/fill.ts",
      "default": "./dist/deno/fill.js",
    },
    "blah": Object {
      "types": "./dist/blah/fill.d.ts",
      "source": "./src/fill.ts",
      "default": "./dist/blah/fill.js",
    },
    "import": Object {
      "types": "./dist/esm/fill.d.ts",
      "source": "./src/fill.ts",
      "default": "./dist/esm/fill.js",
    },
    "require": Object {
      "types": "./dist/commonjs/fill.d.ts",
      "source": "./src/fill.ts",
      "default": "./dist/commonjs/fill.js",
    },
  },
}
`

exports[`test/exports.ts > TAP > liveDev > publish > must match snapshot 1`] = `
Object {
  ".": Object {
    "deno": Object {
      "types": "./dist/deno/index.d.ts",
      "source": "./src/index.ts",
      "default": "./dist/deno/index.js",
    },
    "blah": Object {
      "types": "./dist/blah/index.d.ts",
      "source": "./src/index.ts",
      "default": "./dist/blah/index.js",
    },
    "import": Object {
      "types": "./dist/esm/index.d.ts",
      "source": "./src/index.ts",
      "default": "./dist/esm/index.js",
    },
    "require": Object {
      "types": "./dist/commonjs/index.d.ts",
      "source": "./src/index.ts",
      "default": "./dist/commonjs/index.js",
    },
  },
  "./package.json": "./package.json",
  "./foo": Object {
    "deno": Object {
      "types": "./dist/deno/foo.mjs",
      "source": "./src/foo.mts",
      "default": "./dist/deno/foo.mjs",
    },
    "import": Object {
      "types": "./dist/esm/foo.d.mts",
      "source": "./src/foo.mts",
      "default": "./dist/esm/foo.mjs",
    },
  },
  "./foo-cjs": Object {
    "blah": Object {
      "types": "./dist/blah/foo.cjs",
      "source": "./src/foo.cts",
      "default": "./dist/blah/foo.cjs",
    },
    "require": Object {
      "types": "./dist/commonjs/foo.d.cts",
      "source": "./src/foo.cts",
      "default": "./dist/commonjs/foo.cjs",
    },
  },
  "./fill": Object {
    "deno": Object {
      "types": "./dist/deno/fill.d.ts",
      "source": "./src/fill.ts",
      "default": "./dist/deno/fill.js",
    },
    "blah": Object {
      "types": "./dist/blah/fill.d.ts",
      "source": "./src/fill.ts",
      "default": "./dist/blah/fill.js",
    },
    "import": Object {
      "types": "./dist/esm/fill.d.ts",
      "source": "./src/fill.ts",
      "default": "./dist/esm/fill.js",
    },
    "require": Object {
      "types": "./dist/commonjs/fill.d.ts",
      "source": "./src/fill.ts",
      "default": "./dist/commonjs/fill.js",
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
