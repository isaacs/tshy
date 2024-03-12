/**
 * Generates TypeScript compiler configuration files for building the project.
 *
 * Creates a recommended tsconfig.json if one does not exist in the project root.
 * Extends a base build config, then creates additional configs for each
 * requested dialect (esm, cjs, etc.) that set the correct outDir and excludes.
 *
 * The configs will be written to a .tshy folder that will be cleaned out first.
 */
import chalk from 'chalk'
import { mkdirpSync } from 'mkdirp'
import {
  existsSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { resolve } from 'node:path'
import { join } from 'node:path/posix'
import * as console from './console.js'

// the commonjs build needs to exclude anything that will be polyfilled
import config from './config.js'
import polyfills from './polyfills.js'
import preventVerbatimModuleSyntax from './prevent-verbatim-module-syntax.js'

const {
  dialects = ['esm', 'commonjs'],
  esmDialects = [],
  commonjsDialects = [],
  exclude = [],
} = config

const relativeExclude = exclude.map(e => `../${e}`)

/**
 * The recommended TypeScript config options used as the base for all build configs.
 * Includes recommended compiler options like 'strict', 'noUncheckedIndexedAccess',
 * 'declaration' etc. as well as setting 'module' to 'nodenext' and 'target' to 'es2022'.
 */
export const recommendedTsConfig: Record<string, any> = {
  compilerOptions: {
    declaration: true,
    declarationMap: true,
    esModuleInterop: true,
    forceConsistentCasingInFileNames: true,
    inlineSources: true,
    jsx: 'react',
    module: 'nodenext',
    moduleResolution: 'nodenext',
    noUncheckedIndexedAccess: true,
    resolveJsonModule: true,
    skipLibCheck: true,
    sourceMap: true,
    strict: true,
    target: 'es2022',
  },
}

/**
 * The base TypeScript config used for building.
 * Extends the root tsconfig.json or the tsconfig file
 * defined in `config.project` and sets compilerOptions like
 * rootDir, target, and moduleResolution.
 */
export const baseBuildTsConfig: Record<string, any> = {
  extends:
    config.project === undefined
      ? '../tsconfig.json'
      : join('..', config.project),
  compilerOptions: {
    rootDir: '../src',
    target: 'es2022',
    module: 'nodenext',
    moduleResolution: 'nodenext',
  },
}

/**
 * Generates a TypeScript config for building the CommonJS version of the project.
 *
 * Extends the base build config and sets additional options specific to CommonJS:
 * - Adds polyfill imports to be excluded
 * - Includes .ts, .cts, and .tsx files from src
 * - Sets outDir based on the dialect (cjs or esm)
 */
export const createCommonjsDialectTsConfig = (
  dialect: string
): Record<string, any> => {
  const exclude = [...relativeExclude, '../src/**/*.mts']
  for (const [d, pf] of polyfills) {
    if (d === dialect) continue
    for (const f of pf.map.keys()) {
      exclude.push(`../${join(f)}`)
    }
  }
  return {
    extends: './build.json',
    include: ['../src/**/*.ts', '../src/**/*.cts', '../src/**/*.tsx'],
    exclude,
    compilerOptions: {
      outDir:
        '../.tshy-build/' +
        (dialect === 'cjs' ? 'commonjs' : dialect),
    },
  }
}

/**
 * Generates a TypeScript config for building the ESM version of the project.
 *
 * Extends the base build config and sets additional options specific to ESM:
 * - Adds polyfill imports to be excluded
 * - Includes .ts, .mts, and .tsx files from src
 * - Sets outDir to the provided dialect name
 */
export const createEsmDialectTsConfig = (
  dialect: string
): Record<string, any> => {
  const exclude: string[] = [...relativeExclude]
  for (const [d, pf] of polyfills) {
    if (d === dialect) continue
    for (const f of pf.map.keys()) {
      exclude.push(`../${f}`)
    }
  }
  return {
    extends: './build.json',
    include: ['../src/**/*.ts', '../src/**/*.mts', '../src/**/*.tsx'],
    exclude: exclude,
    compilerOptions: {
      outDir: '../.tshy-build/' + dialect,
    },
  }
}

/**
 * Generates TypeScript config files for building the project.
 *
 * Creates the build output directory. Writes the base build config,
 * as well as configs for CommonJS and ESM builds based on the
 * specified dialects.
 */
export function generateTsConfigFiles() {
  console.log(chalk.cyan.dim('writing tsconfig files...'))
  mkdirpSync('.tshy')
  const writeConfig = (name: string, data: Record<string, any>) =>
    writeFileSync(
      `.tshy/${name}.json`,
      JSON.stringify(data, null, 2) + '\n'
    )

  console.debug(chalk.cyan.dim('writing tsconfig files...'))
  if (config.project === undefined && !existsSync('tsconfig.json')) {
    console.debug('using recommended tsconfig.json')
    writeConfig('../tsconfig', recommendedTsConfig)
  } else {
    if (dialects.length > 1) preventVerbatimModuleSyntax()
    console.debug('using existing tsconfig.json')
  }
  for (const f of readdirSync('.tshy')) {
    unlinkSync(resolve('.tshy', f))
  }
  writeConfig('build', baseBuildTsConfig)
  if (dialects.includes('commonjs')) {
    writeConfig('commonjs', createCommonjsDialectTsConfig('cjs'))
    for (const d of commonjsDialects) {
      writeConfig(d, createCommonjsDialectTsConfig(d))
    }
  }
  if (dialects.includes('esm')) {
    writeConfig('esm', createEsmDialectTsConfig('esm'))
    for (const d of esmDialects) {
      writeConfig(d, createEsmDialectTsConfig(d))
    }
  }
}

export default generateTsConfigFiles
