# 1.15

- Add `liveDev` option
- Add `"source"` export condition

# 1.14

- Do not fail if sourcemaps are not generated
- Support glob patterns in `tshy.exports`
- Add support for TypeScript 5.4

# 1.13

- Take `target` from `tsconfig.json` if present, rather than
  hard-coding in the `build.json` config.
- Find `tsc` where pnpm hides it.

# 1.12

- Respect `package.json` type field if set to `"commonjs"`
- Ignore `package.json` changes in `tshy --watch` if the data
  itself did not change.

# 1.11

- Add support for TypeScript 5.3
- Preserve indentation/newlines in `package.json` files

# 1.10

- Exclude sources from all builds via the `exclude` config
  setting.

# 1.9

- Set a custom tsconfig file via the `project` config setting.

# 1.8

- Support `"incremental": true` tsconfig option, making the build
  directory persistent if there are `*.tsbuildinfo` files
  present.
- Rename build directory from '.tshy-build-tmp' to '.tshy-build',
  since it's not temporary if incremental builds are used.
- Make the `selfLink` best-effort if not explicitly true or
  false.

# 1.7

- Prevent `verbatimModuleSyntax` ts config if building for both
  ESM and CommonJS, as it's fundamentally incompatible
- Add `--watch` option
- Add `--help` option

# 1.6

- put all imports in top-level imports field (2023-10-19)

# 1.5

- Add `tshy.imports` config

# 1.4

- Add `tshy.esmDialects` and `tshy.commonjsDialects` configs
- Use more complete package/import/export types defined by the
  `resolve-import` package

# 1.3

- Default `tshy.main = true` if a `'.'` CommonJS export is
  present

# 1.2

- Initial experimental support for `tshy.main`
- Add `tshy.selfLink` config to suppress the internal symlink

# 1.1

- Add support for local package imports/exports

# 1.0

- Initial version
