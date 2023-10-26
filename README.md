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

## Dual Package Hazards

If you are exporting both CommonJS and ESM forms of a package,
then it is possible for both versions to be loaded at run-time.
However, the CommonJS build is a different module from the ESM
build, and thus a _different thing_ from the point of view of the
JavaScript interpreter in Node.js.

Consider this contrived example:

```js
// import the class from ESM
import { SomeClass } from 'module-built-by-tshy'
import { createRequire } from 'node:module'
const req = createRequire(import.meta.url)

// create an object using the commonjs version
function getObject() {
  const { SomeClass } = require('module-built-by-tshy')
  return new SomeClass()
}

const obj = getObject()
console.log(obj instanceof SomeClass) // false!!
```

In a real program, this might happen because one part of the code
loads the package using `require()` and another loads it using
`import`.

The Node.js documentation
[recommends](https://nodejs.org/api/packages.html#dual-package-hazard)
exporting an ESM wrapper that re-exports the CommonJS code, or
isolating state into a single module used by both CommonJS and
ESM. While these strategies do work, they are not what tshy does.

### What Does tshy Do Instead?

It builds your program twice, into two separate folders, and sets
up exports. By default, the ESM and CommonJS forms live in
separate universes, unaware of one another, and treats the "Dual
Module Hazard" as a simple fact of life.

Which it is.

### "Dual Module Hazard" is a fact of life anyway

Since the advent of npm, circa 2010, module in node have been
potentially duplicated in the dependency graph. Node's nested
`node_modules` resolution algorithm, added in Node 0.4, made this
even easier to leverage, and more likely to occur.

So: **as a package author, you cannot safely rely on there being
exactly one copy of your library loaded at run-time.**

This doesn't mean you shouldn't care about it. It means that you
_should_ take it into consideration always, whether you are using
a hybrid build or not.

If you need to ensure that exactly one copy of something exists
at run-time, whether using a hybrid build or not, you need to
guard this with a check that is not dependent on the dependency
graph, such as a global variable.

```js
const ThereCanBeOnlyOne = Symbol.for('there can be only one')
const g = globalThis as typeof globalThis & {
  [ThereCanBeOnlyOne]?: Thing
}
import { Thing } from './thing.js'
g[ThereCanBeOnlyOne] ??= new Thing
export const thing = g[ThereCanBeOnlyOne]
```

If you find yourself doing this, it's a good idea to pause and
consider if you would be better off with a type check function or
something other than relying on `instanceof`. There are certainly
cases where it's unavoidable, but it can be tricky to work with.

### Module Local State

There are some cases where you need something to be the _same
value_ whether loaded with CommonJS or ESM, but not necessarily
unique to the entire program.

For example, say that there is some package-local set of data,
and it needs to be updated and accessible whether the user is
accessing your package via `import` or `require`.

In this case, we can use a dialect polyfill that pulls in the
state module from a single dialect.

In Node, it's easy for ESM to load CommonJS, but since ESM cannot
be loaded synchronously by CommonJS, I recommend putting the
state in the polyfill, and having the "normal" module access it
from that location.

For example:

```js
// src/index.ts
import { state } from './state.js'
export const setValue = (key: string, value: any) => {
  state[key] = value
}
export const getValue = (key: string) => state[key]
```

```js
// src/state-cjs.cts
// this is the actual "thing"
export const state: Record<string, any> = {}
```

```js
// src/state.ts
// this is what will end up in the esm build
// need a ts-ignore because this is a hack.
//@ts-ignore
import cjsState from '../commonjs/state.js'
export const { state } = cjsState as { state: Record<string, any> }
```

If you need a provide an ESM dialect that _doesn't_ support
CommonJS (eg, deno, browser, etc), then you can do this:

```js
// src/state-deno.mts
// can't load the CJS version, so no dual package hazard
export const state: Record<string, any> = {}
```

See below for more on using dialect specific polyfills.

## Handling Default Exports

`export default` is the bane of hybrid TypeScript modules.

When compiled as CommonJS, this results in creating an export
named `default`, which is not the same as setting
`module.exports`.

```js
// esm, beautiful and clean
import foo from 'foo'
// commonjs, unnecessarily ugly and confusing
// even if you like it for some reason, it's not "the same"
const { default: foo } = require('foo')
```

You can tell TypeScript to do a true default export for CommonJS
by using `export = <whatever>`. However:

- This is not compatible with an ESM build.
- You cannot export types along with it.

In general, when publishing TypeScript packages as both CommonJS
and ESM, it is a good idea to avoid default exports for any
public interfaces.

- No need to polyfill anything.
- Can export types alongside the values.

However, if you are publishing something that _does_ need to
provide a default export (for example, porting a project to
hybrid and/or TypeScript, and want to keep the interface
consistent), you can do it with a CommonJS polyfill.

```ts
// index.ts
// the thing that gets exported for ESM
import { thing } from './main.ts'
import type { SomeType } from './main.ts'

export default thing
export type { SomeType }
```

```ts
// index-cjs.cts
// the polyfill for CommonJS
import * as items from './main.ts'
declare global {
  namespace mything {
    export type SomeType = items.SomeType
  }
}
export = items.thing
```

Then, CommonJS users will get the appropriate thing when they
`import 'mything'`, and can access the type via the global
namespace like `mything.SomeType`.

But in almost all cases, it's much simpler to just use named
exports exclusively.

## Configuration

Mostly, this just uses opinionated convention, and so there is
very little to configure.

Source must be in `./src`. Builds are in `./dist/commonjs` for
CommonJS and `./dist/esm` for ESM.

There is very little configuration for this, but a lot of things
_can_ be configured.

### `exports`

By default, if there is a `src/index.ts` file, then that will be
set as the `"."` export, and the `package.json` file will be
exported as `"./package.json"`, because that's just convenient to
expose.

You can set other entry points by putting something like this in
your `package.json` file:

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
        { "require": [{ "types": "./using-require.d.ts" }, "./using-require.js"]},
        { "types": "./blah.d.ts" },
        "./etc.js"
      ]
    }
  }
}
```

### Package `#imports`

You can use `"imports"` in your package.json, and it will be
handled in the following ways.

Any `"imports"` that resolve to a file built as part of your
program must be a non-conditional string value pointing to the
file in `./src/`. For example:

```json
{
  "imports": {
    "#name": "./src/path/to/name.ts",
    "#utils/*": "./src/path/to/utils/*.ts"
  }
}
```

In the ESM build, `import * from '#name'` will resolve to
`./dist/esm/path/to/name.js`, and will be built for ESM. In the
CommonJS build, `require('#name')` will resolve to
`./dist/commonjs/path/to/name.js` and will be built for CommonJS.

<details>
<summary>tl;dr how this works and why it can't be conditional</summary>

In the built `dist/{dialect}/package.json` files, the `./src`
will be stripped from the path and their file extension changed
from `ts` to `js` (`cts` to `cjs` and `mts` to `mjs`).

It shouldn't be conditional, because the condition is already
implicit in the build. In the CommonJS build, they should be
required, and in the ESM builds, they should be imported, and
there's only one thing that it can resolve to from any given
build.

</details>

If there are any `"imports"` that resolve to something _not_
built by tshy, then tshy will set `scripts.preinstall` to set up
symbolic links at install time to make it work. This just means
that you can't use `scripts.preinstall` for anything else if you
have `"imports"` that aren't managed by tshy. For example:

```json
{
  "imports": {
    "#dep": "@scope/dep/submodule",
    "#conditional": {
      "types": "./vendor/blah.d.ts",
      "require": "./vendor/blah.cjs",
      "import": "./vendor/blah.mjs"
    }
  }
}
```

<details>
<summary>tl;dr explanation</summary>

The `"imports"` field in package.json allows you to set local
package imports, which have the same kind of conditional import
logic as `"exports"`. This is especially useful when you have a
vendored dependency with `require` and `import` variants, modules
that have to be bundled in different ways for different
environments, or different dependencies for different
environments.

These package imports are _always_ resolved against the nearest
`package.json` file, and tshy uses generated package.json files
to set the module dialect to `"type":"module"` in `dist/esm` and
`"type":"commonjs"` in `dist/commonjs`, and it swaps the
`src/package.json` file between this during the `tsc` builds.

Furthermore, local package imports may not be relative files
outside the package folder. They may only be local files within
the local package, or dependencies resolved in `node_modules`.

To support this, tshy copies the `imports` field from the
project's package.json into these dialect-setting generated
package.json files, and creates symlinks into the appropriate
places so that they resolve to the same files on disk.

Because symlinks may not be included in npm packages (and even if
they are included, they won't be unpacked at install time), the
symlinks it places in `./dist` wouldn't do much good. In order to
work around _this_ restriction, tshy creates a node program at
`dist/.tshy-link-imports.mjs`, which generates the symlinks at
install time via the `preinstall` script.

</details>

_If a `tshy.imports` is present (a previous iteration of this
behavior), it will be merged into the top-level `"imports"` and
deleted from the `tshy` section._

### Making Noise

On failure, all logs will be printed.

To print error logs and a `success!` message at the end, set
`TSHY_VERBOSE=1` in the environment.

To print debugging and other extra information, set
`TSHY_VERBOSE=2` in the environment.

### Selecting Dialects

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

### Suppressing the self-link

See below about **Local Package `exports`** for an explanation of
what this is.

Suppress the symlink to the project folder into a `node_modules`
folder in `dist` and `src` by doing this:

```json
{
  "tshy": {
    "selfLink": false
  }
}
```

### Old Style Exports

Versions of node prior to 12.10.0, published in early to mid
2016, did not have support for `exports` as a means for defining
package entry points. Unfortunately, even 7 years later at the
time of this writing, some projects are still using outdated
tools that are not capable of understanding this interface.

If there is a `commonjs` export of the `"."` subpath, and the
`tshy.main` field in package.json is not set to `false`, then
tshy will use that to set the `main` and `types` fields, for
compatibility with these tools.

**Warning: relying on top-level main/types will likely cause
incorrect types to be loaded in some scenarios.**

Use with extreme caution. It's almost always better to _not_
define top-level `main` and `types` fields if you are shipping a
hybrid module. Users will need to update their `module` and
`moduleResolution` tsconfigs appropriately. **That is a good
thing, and will save them future headaches.**

If the `commonjs` dialect is not built, or if a `"."` export is
not created, or if the `"."` export does not support the
`commonjs` dialect, and `main` is explicitly set to `true`, then
the build will fail.

For example, this config:

```json
{
  "tshy": {
    "exports": {
      ".": "./src/index.ts"
    }
  }
}
```

will produce:

```json
{
  "main": "./dist/commonjs/index.js",
  "types": "./dist/commonjs/index.d.ts",
  "type": "module",
  "exports": {
    ".": {
      "require": {
        "types": "./dist/commonjs/index.d.ts",
        "default": "./dist/commonjs/index.js"
      },
      "import": {
        "types": "./dist/esm/index.d.ts",
        "default": "./dist/esm/index.js"
      }
    }
  }
}
```

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

## Other Targets: `browser`, `deno`, etc.

If you have any other dialects that you'd like to support, you
can list them as either `commonjsDialects` or `esmDialects`,
depending on whether you want them to be built as CommonJS or
ESM.

Note that each added dialect you create will result in another
build in the `./dist` folder, so you may wish to use sparingly if
shipping a large project.

For example:

```json
{
  "tshy": {
    "exports": {
      ".": "./src/index.ts"
    },
    "esmDialects": ["deno", "browser"],
    "commonjsDialects": ["webpack"]
  }
}
```

Will result in:

```json
{
  "exports": {
    ".": {
      "deno": {
        "types": "./dist/deno/index.d.ts",
        "default": "./dist/deno/index.js"
      },
      "browser": {
        "types": "./dist/browser/index.d.ts",
        "default": "./dist/browser/index.js"
      },
      "webpack": {
        "types": "./dist/webpack/index.d.ts",
        "default": "./dist/webpack/index.js"
      },
      "require": {
        "types": "./dist/commonjs/index.d.ts",
        "default": "./dist/commonjs/index.js"
      },
      "import": {
        "types": "./dist/esm/index.d.ts",
        "default": "./dist/esm/index.js"
      }
    }
  }
}
```

In each of these, you can use the same kind of dialect override
that works for CommonJS polyfills described above. For
`commonjsDialects` types, create a file named
`<filename>-<dialect>.cts`, and for `esmDialects` types, create a
file named `<filename>-<dialect>.mts`.

For example, to provide deno, browser, and webpack overrides in
the setup above, the following files would be relevant:

```
src/index.ts           # normal esm/cjs version
src/index-cjs.cts      # cjs variant for default commonjs
src/index-browser.mts  # esm variant for the browser
src/index-deno.mts     # esm variant for deno
src/index-webpack.cts  # cjs variant for webpack
```

Note that the `commonjs` override uses the abbreviated `cjs`
name (historical reasons, it was originally the only override
supported), and that the file extension must be `cts` or `mts`
depending on the dialect type that it is.

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

## Local Package `exports`

In order to facilitate local package exports, tshy will create a
symlink to the current package temporarily in
`./src/node_modules` and permanently in `./dist/node_modules`.

If you rely on this feature, you may need to add a `paths`
section to your `tsconfig.json` so that you don't get nagged
constantly by your editor about missing type references.

You can suppress the self-linking by putting this config in
`package.json` but be advised this means that you won't be able
to import from local package exports:

```json
{
  "tshy": {
    "selfLink": false
  }
}
```

<details>
<summary>tl;dr explanation</summary>

Similar to local module imports, Node supports importing the
`exports` of the current package as if it was a dependency of
itself. The generated `package.json` files mess with this similar
to `imports`, but it's much easier to work around.

For example, if you had this in your package.json:

```json
{
  "name": "@my/package",
  "exports": {
    "./foo": {
      "import": "./lib/foo.mjs",
      "require": "./lib/foo.cjs"
    }
  }
}
```

Then any module in the package could do
`import('@my/package/foo')` or `require('@my/package/foo')` to
pull in the appropriate file.

In order to make this wort, tshy links the current project
directory into `./src/node_modules/<pkgname>` during the builds,
and removes the link afterwards, so that TypeScript knows what
those things refer to.

The link is also created in the `dist` folder, but it's only
relevant if your tests load the code from `./dist` rather than
from `./src`. In the install, there's no need to re-create this
link, because the package will be in a `node_modules` folder
already.

If you use this feature, you can put something like this in your
`tsconfig.json` file so that your editor knows what those things
refer to:

```json
{
  "compilerOptions": {
    "paths": {
      "@my/package/foo": ["./src/foo.js"],
      "@my/package/bar": ["./src/bar.js"]
    }
  }
}
```

Note the `.js` extension, rather than `.ts`. Add this for each
submodule path that you use in this way, or use a wildcard if you
prefer, though this might result in failing to catch errors if
you use a submodule identifier that isn't actually exported:

```json
{
  "compilerOptions": {
    "paths": {
      "@my/package/*": ["./src/*.js"]
    }
  }
}
```

</details>
