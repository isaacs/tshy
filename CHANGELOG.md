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
