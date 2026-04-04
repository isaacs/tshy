/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/exports.ts > TAP > extra dialects > commonjs > extras=false type=commonjs > must match snapshot 1`] = `
Object {
  ".": Object {
    "require": Object {
      "my-source": "./src/index-cjs.cts",
      "types": "./dist/commonjs/index.d.ts",
      "default": "./dist/commonjs/index.js",
    },
  },
  "./foo": Object {
    "require": Object {
      "my-source": "./src/foo.ts",
      "types": "./dist/commonjs/foo.d.ts",
      "default": "./dist/commonjs/foo.js",
    },
  },
}
`

exports[`test/exports.ts > TAP > extra dialects > commonjs > extras=false type=module > must match snapshot 1`] = `
Object {
  ".": Object {
    "require": Object {
      "my-source": "./src/index-cjs.cts",
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

exports[`test/exports.ts > TAP > extra dialects > commonjs > extras=true type=commonjs > must match snapshot 1`] = `
Object {
  ".": Object {
    "require": Object {
      "blah": Object {
        "my-source": "./src/index-blah.ts",
        "types": "./dist/commonjs/blah/index.d.ts",
        "default": "./dist/commonjs/blah/index.js",
      },
      "my-source": "./src/index-cjs.cts",
      "types": "./dist/commonjs/index.d.ts",
      "default": "./dist/commonjs/index.js",
    },
  },
  "./foo": Object {
    "require": Object {
      "blah": Object {
        "my-source": "./src/foo-blah.cts",
        "types": "./dist/commonjs/blah/foo.d.ts",
        "default": "./dist/commonjs/blah/foo.js",
      },
      "my-source": "./src/foo.ts",
      "types": "./dist/commonjs/foo.d.ts",
      "default": "./dist/commonjs/foo.js",
    },
  },
}
`

exports[`test/exports.ts > TAP > extra dialects > commonjs > extras=true type=module > must match snapshot 1`] = `
Object {
  ".": Object {
    "require": Object {
      "blah": Object {
        "types": "./dist/commonjs/blah/index.d.ts",
        "default": "./dist/commonjs/blah/index.js",
      },
      "my-source": "./src/index-cjs.cts",
      "types": "./dist/commonjs/index.d.ts",
      "default": "./dist/commonjs/index.js",
    },
  },
  "./foo": Object {
    "require": Object {
      "blah": Object {
        "my-source": "./src/foo-blah.cts",
        "types": "./dist/commonjs/blah/foo.d.ts",
        "default": "./dist/commonjs/blah/foo.js",
      },
      "types": "./dist/commonjs/foo.d.ts",
      "default": "./dist/commonjs/foo.js",
    },
  },
}
`

exports[`test/exports.ts > TAP > extra dialects > esm > extras=false type=commonjs > must match snapshot 1`] = `
Object {
  ".": Object {
    "import": Object {
      "types": "./dist/esm/index.d.ts",
      "default": "./dist/esm/index.js",
    },
  },
  "./foo": Object {
    "import": Object {
      "my-source": "./src/foo-esm.mts",
      "types": "./dist/esm/foo.d.ts",
      "default": "./dist/esm/foo.js",
    },
  },
}
`

exports[`test/exports.ts > TAP > extra dialects > esm > extras=false type=module > must match snapshot 1`] = `
Object {
  ".": Object {
    "import": Object {
      "my-source": "./src/index.ts",
      "types": "./dist/esm/index.d.ts",
      "default": "./dist/esm/index.js",
    },
  },
  "./foo": Object {
    "import": Object {
      "my-source": "./src/foo-esm.mts",
      "types": "./dist/esm/foo.d.ts",
      "default": "./dist/esm/foo.js",
    },
  },
}
`

exports[`test/exports.ts > TAP > extra dialects > esm > extras=true type=commonjs > must match snapshot 1`] = `
Object {
  ".": Object {
    "import": Object {
      "deno": Object {
        "my-source": "./src/index-deno.mts",
        "types": "./dist/esm/deno/index.d.ts",
        "default": "./dist/esm/deno/index.js",
      },
      "no-overrides": Object {
        "types": "./dist/esm/no-overrides/index.d.ts",
        "default": "./dist/esm/no-overrides/index.js",
      },
      "types": "./dist/esm/index.d.ts",
      "default": "./dist/esm/index.js",
    },
  },
  "./foo": Object {
    "import": Object {
      "deno": Object {
        "types": "./dist/esm/deno/foo.d.ts",
        "default": "./dist/esm/deno/foo.js",
      },
      "no-overrides": Object {
        "types": "./dist/esm/no-overrides/foo.d.ts",
        "default": "./dist/esm/no-overrides/foo.js",
      },
      "my-source": "./src/foo-esm.mts",
      "types": "./dist/esm/foo.d.ts",
      "default": "./dist/esm/foo.js",
    },
  },
}
`

exports[`test/exports.ts > TAP > extra dialects > esm > extras=true type=module > must match snapshot 1`] = `
Object {
  ".": Object {
    "import": Object {
      "deno": Object {
        "my-source": "./src/index-deno.mts",
        "types": "./dist/esm/deno/index.d.ts",
        "default": "./dist/esm/deno/index.js",
      },
      "no-overrides": Object {
        "my-source": "./src/index.ts",
        "types": "./dist/esm/no-overrides/index.d.ts",
        "default": "./dist/esm/no-overrides/index.js",
      },
      "my-source": "./src/index.ts",
      "types": "./dist/esm/index.d.ts",
      "default": "./dist/esm/index.js",
    },
  },
  "./foo": Object {
    "import": Object {
      "deno": Object {
        "my-source": "./src/foo.ts",
        "types": "./dist/esm/deno/foo.d.ts",
        "default": "./dist/esm/deno/foo.js",
      },
      "no-overrides": Object {
        "my-source": "./src/foo.ts",
        "types": "./dist/esm/no-overrides/foo.d.ts",
        "default": "./dist/esm/no-overrides/foo.js",
      },
      "my-source": "./src/foo-esm.mts",
      "types": "./dist/esm/foo.d.ts",
      "default": "./dist/esm/foo.js",
    },
  },
}
`

exports[`test/exports.ts > TAP > extra dialects > undefined > extras=false type=commonjs > must match snapshot 1`] = `
Object {
  ".": Object {
    "import": Object {
      "types": "./dist/esm/index.d.ts",
      "default": "./dist/esm/index.js",
    },
    "require": Object {
      "my-source": "./src/index-cjs.cts",
      "types": "./dist/commonjs/index.d.ts",
      "default": "./dist/commonjs/index.js",
    },
  },
  "./foo": Object {
    "import": Object {
      "my-source": "./src/foo-esm.mts",
      "types": "./dist/esm/foo.d.ts",
      "default": "./dist/esm/foo.js",
    },
    "require": Object {
      "my-source": "./src/foo.ts",
      "types": "./dist/commonjs/foo.d.ts",
      "default": "./dist/commonjs/foo.js",
    },
  },
}
`

exports[`test/exports.ts > TAP > extra dialects > undefined > extras=false type=module > must match snapshot 1`] = `
Object {
  ".": Object {
    "import": Object {
      "my-source": "./src/index.ts",
      "types": "./dist/esm/index.d.ts",
      "default": "./dist/esm/index.js",
    },
    "require": Object {
      "my-source": "./src/index-cjs.cts",
      "types": "./dist/commonjs/index.d.ts",
      "default": "./dist/commonjs/index.js",
    },
  },
  "./foo": Object {
    "import": Object {
      "my-source": "./src/foo-esm.mts",
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

exports[`test/exports.ts > TAP > extra dialects > undefined > extras=true type=commonjs > must match snapshot 1`] = `
Object {
  ".": Object {
    "import": Object {
      "deno": Object {
        "my-source": "./src/index-deno.mts",
        "types": "./dist/esm/deno/index.d.ts",
        "default": "./dist/esm/deno/index.js",
      },
      "no-overrides": Object {
        "types": "./dist/esm/no-overrides/index.d.ts",
        "default": "./dist/esm/no-overrides/index.js",
      },
      "types": "./dist/esm/index.d.ts",
      "default": "./dist/esm/index.js",
    },
    "require": Object {
      "blah": Object {
        "my-source": "./src/index-blah.ts",
        "types": "./dist/commonjs/blah/index.d.ts",
        "default": "./dist/commonjs/blah/index.js",
      },
      "my-source": "./src/index-cjs.cts",
      "types": "./dist/commonjs/index.d.ts",
      "default": "./dist/commonjs/index.js",
    },
  },
  "./foo": Object {
    "import": Object {
      "deno": Object {
        "types": "./dist/esm/deno/foo.d.ts",
        "default": "./dist/esm/deno/foo.js",
      },
      "no-overrides": Object {
        "types": "./dist/esm/no-overrides/foo.d.ts",
        "default": "./dist/esm/no-overrides/foo.js",
      },
      "my-source": "./src/foo-esm.mts",
      "types": "./dist/esm/foo.d.ts",
      "default": "./dist/esm/foo.js",
    },
    "require": Object {
      "blah": Object {
        "my-source": "./src/foo-blah.cts",
        "types": "./dist/commonjs/blah/foo.d.ts",
        "default": "./dist/commonjs/blah/foo.js",
      },
      "my-source": "./src/foo.ts",
      "types": "./dist/commonjs/foo.d.ts",
      "default": "./dist/commonjs/foo.js",
    },
  },
}
`

exports[`test/exports.ts > TAP > extra dialects > undefined > extras=true type=module > must match snapshot 1`] = `
Object {
  ".": Object {
    "import": Object {
      "deno": Object {
        "my-source": "./src/index-deno.mts",
        "types": "./dist/esm/deno/index.d.ts",
        "default": "./dist/esm/deno/index.js",
      },
      "no-overrides": Object {
        "my-source": "./src/index.ts",
        "types": "./dist/esm/no-overrides/index.d.ts",
        "default": "./dist/esm/no-overrides/index.js",
      },
      "my-source": "./src/index.ts",
      "types": "./dist/esm/index.d.ts",
      "default": "./dist/esm/index.js",
    },
    "require": Object {
      "blah": Object {
        "types": "./dist/commonjs/blah/index.d.ts",
        "default": "./dist/commonjs/blah/index.js",
      },
      "my-source": "./src/index-cjs.cts",
      "types": "./dist/commonjs/index.d.ts",
      "default": "./dist/commonjs/index.js",
    },
  },
  "./foo": Object {
    "import": Object {
      "deno": Object {
        "my-source": "./src/foo.ts",
        "types": "./dist/esm/deno/foo.d.ts",
        "default": "./dist/esm/deno/foo.js",
      },
      "no-overrides": Object {
        "my-source": "./src/foo.ts",
        "types": "./dist/esm/no-overrides/foo.d.ts",
        "default": "./dist/esm/no-overrides/foo.js",
      },
      "my-source": "./src/foo-esm.mts",
      "types": "./dist/esm/foo.d.ts",
      "default": "./dist/esm/foo.js",
    },
    "require": Object {
      "blah": Object {
        "my-source": "./src/foo-blah.cts",
        "types": "./dist/commonjs/blah/foo.d.ts",
        "default": "./dist/commonjs/blah/foo.js",
      },
      "types": "./dist/commonjs/foo.d.ts",
      "default": "./dist/commonjs/foo.js",
    },
  },
}
`

exports[`test/exports.ts > TAP > liveDev > commonjs > no envs > must match snapshot 1`] = `
Object {
  ".": Object {
    "import": Object {
      "deno": Object {
        "default": "./dist/esm/deno/index.ts",
      },
      "default": "./dist/esm/index.ts",
    },
    "require": Object {
      "blah": Object {
        "default": "./dist/commonjs/blah/index.ts",
      },
      "default": "./dist/commonjs/index.ts",
    },
  },
  "./package.json": "./package.json",
  "./foo": Object {
    "import": Object {
      "deno": Object {
        "default": "./dist/esm/deno/foo.mts",
      },
      "default": "./dist/esm/foo.mts",
    },
  },
  "./foo-cjs": Object {
    "require": Object {
      "blah": Object {
        "default": "./dist/commonjs/blah/foo.cts",
      },
      "default": "./dist/commonjs/foo.cts",
    },
  },
  "./fill": Object {
    "import": Object {
      "deno": Object {
        "default": "./dist/esm/deno/fill.ts",
      },
      "default": "./dist/esm/fill.ts",
    },
    "require": Object {
      "blah": Object {
        "default": "./dist/commonjs/blah/fill.ts",
      },
      "default": "./dist/commonjs/fill.ts",
    },
  },
}
`

exports[`test/exports.ts > TAP > liveDev > commonjs > pack > must match snapshot 1`] = `
Object {
  ".": Object {
    "import": Object {
      "deno": Object {
        "types": "./dist/esm/deno/index.d.ts",
        "default": "./dist/esm/deno/index.js",
      },
      "types": "./dist/esm/index.d.ts",
      "default": "./dist/esm/index.js",
    },
    "require": Object {
      "blah": Object {
        "types": "./dist/commonjs/blah/index.d.ts",
        "default": "./dist/commonjs/blah/index.js",
      },
      "types": "./dist/commonjs/index.d.ts",
      "default": "./dist/commonjs/index.js",
    },
  },
  "./package.json": "./package.json",
  "./foo": Object {
    "import": Object {
      "deno": Object {
        "types": "./dist/esm/deno/foo.mjs",
        "default": "./dist/esm/deno/foo.mjs",
      },
      "types": "./dist/esm/foo.d.mts",
      "default": "./dist/esm/foo.mjs",
    },
  },
  "./foo-cjs": Object {
    "require": Object {
      "blah": Object {
        "types": "./dist/commonjs/blah/foo.cjs",
        "default": "./dist/commonjs/blah/foo.cjs",
      },
      "types": "./dist/commonjs/foo.d.cts",
      "default": "./dist/commonjs/foo.cjs",
    },
  },
  "./fill": Object {
    "import": Object {
      "deno": Object {
        "types": "./dist/esm/deno/fill.d.ts",
        "default": "./dist/esm/deno/fill.js",
      },
      "types": "./dist/esm/fill.d.ts",
      "default": "./dist/esm/fill.js",
    },
    "require": Object {
      "blah": Object {
        "types": "./dist/commonjs/blah/fill.d.ts",
        "default": "./dist/commonjs/blah/fill.js",
      },
      "types": "./dist/commonjs/fill.d.ts",
      "default": "./dist/commonjs/fill.js",
    },
  },
}
`

exports[`test/exports.ts > TAP > liveDev > commonjs > publish > must match snapshot 1`] = `
Object {
  ".": Object {
    "import": Object {
      "deno": Object {
        "types": "./dist/esm/deno/index.d.ts",
        "default": "./dist/esm/deno/index.js",
      },
      "types": "./dist/esm/index.d.ts",
      "default": "./dist/esm/index.js",
    },
    "require": Object {
      "blah": Object {
        "types": "./dist/commonjs/blah/index.d.ts",
        "default": "./dist/commonjs/blah/index.js",
      },
      "types": "./dist/commonjs/index.d.ts",
      "default": "./dist/commonjs/index.js",
    },
  },
  "./package.json": "./package.json",
  "./foo": Object {
    "import": Object {
      "deno": Object {
        "types": "./dist/esm/deno/foo.mjs",
        "default": "./dist/esm/deno/foo.mjs",
      },
      "types": "./dist/esm/foo.d.mts",
      "default": "./dist/esm/foo.mjs",
    },
  },
  "./foo-cjs": Object {
    "require": Object {
      "blah": Object {
        "types": "./dist/commonjs/blah/foo.cjs",
        "default": "./dist/commonjs/blah/foo.cjs",
      },
      "types": "./dist/commonjs/foo.d.cts",
      "default": "./dist/commonjs/foo.cjs",
    },
  },
  "./fill": Object {
    "import": Object {
      "deno": Object {
        "types": "./dist/esm/deno/fill.d.ts",
        "default": "./dist/esm/deno/fill.js",
      },
      "types": "./dist/esm/fill.d.ts",
      "default": "./dist/esm/fill.js",
    },
    "require": Object {
      "blah": Object {
        "types": "./dist/commonjs/blah/fill.d.ts",
        "default": "./dist/commonjs/blah/fill.js",
      },
      "types": "./dist/commonjs/fill.d.ts",
      "default": "./dist/commonjs/fill.js",
    },
  },
}
`

exports[`test/exports.ts > TAP > liveDev > module > no envs > must match snapshot 1`] = `
Object {
  ".": Object {
    "import": Object {
      "deno": Object {
        "default": "./dist/esm/deno/index.ts",
      },
      "default": "./dist/esm/index.ts",
    },
    "require": Object {
      "blah": Object {
        "default": "./dist/commonjs/blah/index.ts",
      },
      "default": "./dist/commonjs/index.ts",
    },
  },
  "./package.json": "./package.json",
  "./foo": Object {
    "import": Object {
      "deno": Object {
        "default": "./dist/esm/deno/foo.mts",
      },
      "default": "./dist/esm/foo.mts",
    },
  },
  "./foo-cjs": Object {
    "require": Object {
      "blah": Object {
        "default": "./dist/commonjs/blah/foo.cts",
      },
      "default": "./dist/commonjs/foo.cts",
    },
  },
  "./fill": Object {
    "import": Object {
      "deno": Object {
        "default": "./dist/esm/deno/fill.ts",
      },
      "default": "./dist/esm/fill.ts",
    },
    "require": Object {
      "blah": Object {
        "default": "./dist/commonjs/blah/fill.ts",
      },
      "default": "./dist/commonjs/fill.ts",
    },
  },
}
`

exports[`test/exports.ts > TAP > liveDev > module > pack > must match snapshot 1`] = `
Object {
  ".": Object {
    "import": Object {
      "deno": Object {
        "types": "./dist/esm/deno/index.d.ts",
        "default": "./dist/esm/deno/index.js",
      },
      "types": "./dist/esm/index.d.ts",
      "default": "./dist/esm/index.js",
    },
    "require": Object {
      "blah": Object {
        "types": "./dist/commonjs/blah/index.d.ts",
        "default": "./dist/commonjs/blah/index.js",
      },
      "types": "./dist/commonjs/index.d.ts",
      "default": "./dist/commonjs/index.js",
    },
  },
  "./package.json": "./package.json",
  "./foo": Object {
    "import": Object {
      "deno": Object {
        "types": "./dist/esm/deno/foo.mjs",
        "default": "./dist/esm/deno/foo.mjs",
      },
      "types": "./dist/esm/foo.d.mts",
      "default": "./dist/esm/foo.mjs",
    },
  },
  "./foo-cjs": Object {
    "require": Object {
      "blah": Object {
        "types": "./dist/commonjs/blah/foo.cjs",
        "default": "./dist/commonjs/blah/foo.cjs",
      },
      "types": "./dist/commonjs/foo.d.cts",
      "default": "./dist/commonjs/foo.cjs",
    },
  },
  "./fill": Object {
    "import": Object {
      "deno": Object {
        "types": "./dist/esm/deno/fill.d.ts",
        "default": "./dist/esm/deno/fill.js",
      },
      "types": "./dist/esm/fill.d.ts",
      "default": "./dist/esm/fill.js",
    },
    "require": Object {
      "blah": Object {
        "types": "./dist/commonjs/blah/fill.d.ts",
        "default": "./dist/commonjs/blah/fill.js",
      },
      "types": "./dist/commonjs/fill.d.ts",
      "default": "./dist/commonjs/fill.js",
    },
  },
}
`

exports[`test/exports.ts > TAP > liveDev > module > publish > must match snapshot 1`] = `
Object {
  ".": Object {
    "import": Object {
      "deno": Object {
        "types": "./dist/esm/deno/index.d.ts",
        "default": "./dist/esm/deno/index.js",
      },
      "types": "./dist/esm/index.d.ts",
      "default": "./dist/esm/index.js",
    },
    "require": Object {
      "blah": Object {
        "types": "./dist/commonjs/blah/index.d.ts",
        "default": "./dist/commonjs/blah/index.js",
      },
      "types": "./dist/commonjs/index.d.ts",
      "default": "./dist/commonjs/index.js",
    },
  },
  "./package.json": "./package.json",
  "./foo": Object {
    "import": Object {
      "deno": Object {
        "types": "./dist/esm/deno/foo.mjs",
        "default": "./dist/esm/deno/foo.mjs",
      },
      "types": "./dist/esm/foo.d.mts",
      "default": "./dist/esm/foo.mjs",
    },
  },
  "./foo-cjs": Object {
    "require": Object {
      "blah": Object {
        "types": "./dist/commonjs/blah/foo.cjs",
        "default": "./dist/commonjs/blah/foo.cjs",
      },
      "types": "./dist/commonjs/foo.d.cts",
      "default": "./dist/commonjs/foo.cjs",
    },
  },
  "./fill": Object {
    "import": Object {
      "deno": Object {
        "types": "./dist/esm/deno/fill.d.ts",
        "default": "./dist/esm/deno/fill.js",
      },
      "types": "./dist/esm/fill.d.ts",
      "default": "./dist/esm/fill.js",
    },
    "require": Object {
      "blah": Object {
        "types": "./dist/commonjs/blah/fill.d.ts",
        "default": "./dist/commonjs/blah/fill.js",
      },
      "types": "./dist/commonjs/fill.d.ts",
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

exports[`test/exports.ts > TAP > setting top level main > invalid module esm, no exports > must match snapshot 1`] = `
Array [
  Array [
    "could not resolve exports['.'] for tshy.module 'import'",
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
