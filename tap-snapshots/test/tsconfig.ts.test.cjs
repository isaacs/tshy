/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/tsconfig.ts > TAP > .tshy/build.json 1`] = `
Object {
  "compilerOptions": Object {
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "rootDir": "../src",
    "target": "es2022",
  },
  "extends": "../tsconfig.json",
}
`

exports[`test/tsconfig.ts > TAP > .tshy/build.json generate everything 1`] = `
Object {
  "compilerOptions": Object {
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "rootDir": "../src",
    "target": "es2022",
  },
  "extends": "../tsconfig.json",
}
`

exports[`test/tsconfig.ts > TAP > .tshy/commonjs.json 1`] = `
Object {
  "compilerOptions": Object {
    "outDir": "../.tshy-build/commonjs",
  },
  "exclude": Array [
    "../src/**/*.mts",
    "../src/index-deno.mts",
  ],
  "extends": "./build.json",
  "include": Array [
    "../src/**/*.ts",
    "../src/**/*.cts",
    "../src/**/*.tsx",
  ],
}
`

exports[`test/tsconfig.ts > TAP > .tshy/commonjs.json generate everything 1`] = `
Object {
  "compilerOptions": Object {
    "outDir": "../.tshy-build/commonjs",
  },
  "exclude": Array [
    "../src/**/*.mts",
    "../src/index-deno.mts",
  ],
  "extends": "./build.json",
  "include": Array [
    "../src/**/*.ts",
    "../src/**/*.cts",
    "../src/**/*.tsx",
  ],
}
`

exports[`test/tsconfig.ts > TAP > .tshy/deno.json 1`] = `
Object {
  "compilerOptions": Object {
    "outDir": "../.tshy-build/deno",
  },
  "exclude": Array [
    ".././src/index-cjs.cts",
  ],
  "extends": "./build.json",
  "include": Array [
    "../src/**/*.ts",
    "../src/**/*.mts",
    "../src/**/*.tsx",
  ],
}
`

exports[`test/tsconfig.ts > TAP > .tshy/esm.json 1`] = `
Object {
  "compilerOptions": Object {
    "outDir": "../.tshy-build/esm",
  },
  "exclude": Array [
    ".././src/index-cjs.cts",
    ".././src/index-deno.mts",
  ],
  "extends": "./build.json",
  "include": Array [
    "../src/**/*.ts",
    "../src/**/*.mts",
    "../src/**/*.tsx",
  ],
}
`

exports[`test/tsconfig.ts > TAP > .tshy/esm.json generate everything 1`] = `
Object {
  "compilerOptions": Object {
    "outDir": "../.tshy-build/esm",
  },
  "exclude": Array [
    ".././src/index-cjs.cts",
    ".././src/index-deno.mts",
  ],
  "extends": "./build.json",
  "include": Array [
    "../src/**/*.ts",
    "../src/**/*.mts",
    "../src/**/*.tsx",
  ],
}
`

exports[`test/tsconfig.ts > TAP > .tshy/webpack.json 1`] = `
Object {
  "compilerOptions": Object {
    "outDir": "../.tshy-build/webpack",
  },
  "exclude": Array [
    "../src/**/*.mts",
    "../src/index-cjs.cts",
    "../src/index-deno.mts",
  ],
  "extends": "./build.json",
  "include": Array [
    "../src/**/*.ts",
    "../src/**/*.cts",
    "../src/**/*.tsx",
  ],
}
`

exports[`test/tsconfig.ts > TAP > tsconfig.json 1`] = `
Object {
  "compilerOptions": Object {
    "this_data": "is preserved",
    "yolo": "🍑",
  },
}
`

exports[`test/tsconfig.ts > TAP > tsconfig.json generate everything 1`] = `
Object {
  "compilerOptions": Object {
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "inlineSources": true,
    "jsx": "react",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "noUncheckedIndexedAccess": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "target": "es2022",
  },
}
`
