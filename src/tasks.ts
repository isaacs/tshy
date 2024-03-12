export { default as makeBinsExecutable } from './bins.js'
export { default as setFolderDialect } from './set-folder-dialect.js'
export { default as failBuild } from './build-fail.js'
export { default as getBuiltImports } from './built-imports.js'
export { default as cleanBuildFolder } from './clean-build-tmp.js'
export { isValidTshyConfig, default as config } from './config.js'
export * as console from './console.js'
export {
  getExports,
  getImpTarget as getImportTargetPath,
  getReqTarget as getRequireTargetPath,
  setMain,
  updatePackageExports,
} from './exports.js'
export { default as printFailureMessage } from './fail.js'
export { default as pkg, readPackageJson } from './package.js'
export { default as polyfillFiles } from './polyfills.js'

export { default as preventVerbatimModuleSyntax } from './prevent-verbatim-module-syntax.js'
export { default as readTypescriptConfig } from './read-typescript-config.js'
export { resolveExport } from './resolve-export.js'
export {
  link as linkSelf,
  unlink as unlinkSelfDep,
} from './self-link.js'
export { getSrcFiles, getSourcesFrom } from './sources.js'
export {
  baseBuildTsConfig,
  createCommonjsDialectTsConfig,
  createEsmDialectTsConfig,
  recommendedTsConfig,
  generateTsConfigFiles,
} from './tsconfig.js'
export * from './types.js'
export {
  link as linkImports,
  unlink as unlinkImports,
} from './unbuilt-imports.js'

export { isValidDialect } from './valid-dialects.js'
export { isValidExclude } from './valid-exclude.js'
export { isValidExports } from './valid-exports.js'
export { isValidExternalExport } from './valid-external-export.js'
export {
  isValidExtraDialectConfig,
  isValidExtraDialectSet,
} from './valid-extra-dialects.js'
export { isValidImportsConfig } from './valid-imports.js'
export { isValidProject } from './valid-project.js'
export { default as writePackageJson } from './write-package.js'
