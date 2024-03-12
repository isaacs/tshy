import chalk from 'chalk'
import { syncContentSync } from 'sync-content'
import bins from './bins.js'
import { buildCommonJS } from './build-commonjs.js'
import { buildESM } from './build-esm.js'
import cleanBuildTmp from './clean-build-tmp.js'
import * as console from './console.js'
import dialects from './dialects.js'
import pkg from './package.js'
import {
  link as linkSelfDep,
  unlink as unlinkSelfDep,
} from './self-link.js'
import { generateTsConfigFiles } from './tsconfig.js'
import {
  link as linkImports,
  save as saveImports,
  unlink as unlinkImports,
} from './unbuilt-imports.js'
import writePackage from './write-package.js'

await generateTsConfigFiles()

export default async () => {
  cleanBuildTmp()

  linkSelfDep(pkg, 'src')
  await linkImports(pkg, 'src')
  if (dialects.includes('esm')) buildESM()
  if (dialects.includes('commonjs')) buildCommonJS()
  await unlinkImports(pkg, 'src')
  unlinkSelfDep(pkg, 'src')

  console.debug(chalk.cyan.dim('moving to ./dist'))
  syncContentSync('.tshy-build', 'dist')
  console.debug(chalk.cyan.dim('cleaning build temp dir'))

  cleanBuildTmp()

  linkSelfDep(pkg, 'dist')

  if (pkg.imports) {
    console.debug('linking package imports', pkg.imports)
    if (dialects.includes('commonjs'))
      await linkImports(pkg, 'dist/commonjs', true)
    if (dialects.includes('esm'))
      await linkImports(pkg, 'dist/esm', true)
    if (saveImports('dist/.tshy-link-imports.mjs')) {
      pkg.scripts = pkg.scripts || {}
      pkg.scripts.preinstall =
        'node -e "import(process.argv[1]).catch(()=>{})" ' +
        'dist/.tshy-link-imports.mjs'
    }
  }

  console.debug(chalk.cyan.dim('chmod bins'))
  bins()
  console.debug(chalk.cyan.dim('write package.json'))
  writePackage()
}
