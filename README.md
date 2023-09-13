# tshy - TypeScript HYbridizer

Hybrid (CommonJS/ESM) TypeScript node package builder. Write
modules that Just Work in ESM and CommonJS, in easy mode.

This tool manages the `exports` in your package.json file, and
builds your TypeScript program using `tsc` 5.2, emitting both ESM
and CommonJS variants, [providing the full strength of
TypeScript’s checking for both output
formats](https://twitter.com/atcb/status/1702069237710479608).

## USAGE

Install tshy:

```
npm i -D tshy
```

Put this in your package.json to use it with the default configs:

```json
{
  "files": ["dist"],
  "scripts": {
    "prepare": "tshy"
  }
}
```

Put your source code in `./src`.

The built files will end up in `./dist/esm` (ESM) and
`./dist/commonjs` (CommonJS).

Your `exports` will be edited to reflect the correct module entry
points.

## Configuration

Mostly, this just uses opinionated convention, and so there is
very little to configure.

Source must be in `./src`. Builds are in `./dist/commonjs` for
CommonJS and `./dist/esm` for ESM.

There is very little configuration for this. The only thing to
decide is the exported paths. If you have a `./index.ts` file,
then that will be listed as the main `"."` export by default.

You can set other entry points by putting this in your
`package.json` file:

```json
{
  "tshy": {
    "exports": {
      "./foo": "./src/foo.ts",
      "./bar": "./src/bar.ts",
      ".": "./src/something-other-than-index.ts",
      "./package.json": "./package.json"
    }
  }
}
```

Any exports pointing to files in `./src` will be updated to their
appropriate build target locations, like:

```json
{
  "exports": {
    "./foo": {
      "import": {
        "types": "./dist/esm/foo.d.ts",
        "default": "./dist/esm/foo.js"
      },
      "require": {
        "types": "./dist/commonjs/foo.d.ts",
        "default": "./dist/commonjs/foo.js"
      }
    }
  }
}
```

Any exports that are not within `./src` will not be built, and
can be anything supported by package.json `exports`, as they will
just be passed through as-is.

```json
{
  "tshy": {
    "exports": {
      ".": "./src/my-built-module.ts",
      "./package.json": "./package.json"
      "./thing": {
        "import": "./lib/thing.mjs",
        "require": "./lib/thing.cjs",
        "types": "./lib/thing.d.ts"
      },
      "./arraystyle": [
        { "import": "./no-op.js" },
        { "browser": "./browser-thing.js" },
        { "require": [{ "types": "./using-require.d.ts" }, "./using-require.js"],
        { "types": "./blah.d.ts" },
        "./etc.js"
      ]
    }
  }
}
```

## Making Noise

On failure, all logs will be printed.

To print error logs and a `success!` message at the end, set
`TSHY_VERBOSE=1` in the environment.

To print debugging and other extra information, set
`TSHY_VERBOSE=2` in the environment.

## Selecting Dialects

You can tell tshy which dialect you're building for by setting
the `dialects` config to an array of strings:

```json
{
  "tshy": {
    "dialects": ["esm", "commonjs"]
  }
}
```

The default is `["esm", "commonjs"]` (ie, both of them). If you
set it to just one, then only that dialect will be built and
exported.

## CommonJS Dialect Polyfills

Sometimes you have to do something in different ways depending on
the JS dialect in use. For example, maybe you have to use
`import.meta.url` in ESM, but polyfill with
`pathToFileURL(__filename)` in CommonJS.

To do this, create a polyfill file with the CommonJS code in
`<name>-cjs.cts`. (The `cts` extension matters.)

```js
// src/source-dir-cjs.cts
//     ^^^^^^^^^^--------- matching name
//               ^^^^----- "-cjs" tag
//                   ^^^^- ".cts" filename suffix
// this one has a -cjs.cts suffix, so it will override the
// module at src/source-dir.ts in the CJS build,
// and be excluded from the esm build.
import { pathToFileURL } from 'node:url'
//@ts-ignore - Have to ignore because TSC thinks this is ESM
export const sourceDir = pathToFileURL(__dirname)
```

Then put the "real" ESM code in `<name>.ts` (not `.mts`!)

You will generally have to `//@ts-ignore` a bunch of stuff to get
the CommonJS build to ignore it, so it's best to keep the
polyfill surface as small as possible.

```js
// src/source-dir.ts
// This is the ESM version of the module
//@ts-ignore
export const sourceDir = new URL('.', import.meta.url)
```

Then in your code, you can just `import { sourceDir } from
'./source-dir.js'` and it'll work in both builds.

## Excluding from a build using `.cts` and `.mts` files

Files named `*.mts` will be excluded from the CommonJS build.

Files named `*.cts` will be excluded from the ESM build.

If you need to do something one way for CommonJS and another way for
esm, use the "Dialect Switching" trick, with the ESM code living
in `src/<whatever>.ts` and the CommonJS polyfill living in
`src/<whatever>-cjs.cts`.

## Atomic Builds

Code is built in `./.tshy-build-tmp` and then copied over only if
the build succeeds. This makes it work in monorepo cases where
you may have packages that depend on one another and are all
being built in parallel (as long as they've been built one time,
of course).

## Exports Management

The `exports` field in your package.json file will be updated
based on the `tshy.exports` configuration, as described above.

If you don't provide that config, then the default is:

```json
{
  "tshy": {
    "exports": {
      ".": "./src/index.ts",
      "./package.json": "./package.json"
    }
  }
}
```

## Package `#imports`

Using the `imports` field in `package.json` is not currently
supported, because this looks at the nearest `package.json` to
get local imports, and the package.json files placed in
`dist/{commonjs,esm}` can't have local imports outside of their
folders.

There's a way it could theoretically be done, but it's a bit
complicated. A future version may support this.

## TSConfigs

Put whatever configuration you want in `tsconfig.json`, with the
following caveats:

- `include` - will be overridden based on build, best omitted
- `exclude` - will be overridden based on build, best omitted
- compilerOptions:
  - `outDir` - will be overridden based on build, best omitted
  - `rootDir` - will be set to `./src` in the build, can only
    cause annoying errors otherwise.
  - `target` - will be set to `es2022`
  - `module` - will be set to `NodeNext`
  - `moduleResolution` - will be set to `NodeNext`

If you don't have a `tsconfig.json` file, then one will be
provided for you.

Then the `tsconfig.json` file will be used as the default project
for code hints in VSCode, neovim, tests, etc.

## `src/package.json`

As of TypeScript 5.2, the only way to emit JavaScript to ESM or
cjs, and also import packages using node-style `"exports"`-aware
module resolution, is to set the `type` field in the
`package.json` file closest to the TypeScript source code.

During the build, `tshy` will create a file at `src/package.json`
for this purpose, and then delete it afterwards. If that file
exists and _wasn't_ put there by `tshy`, then it will be
destroyed.
