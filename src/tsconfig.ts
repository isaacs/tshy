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
import readTypescriptConfig from './read-typescript-config.js'

const {
  dialects = ['esm', 'commonjs'],
  esmDialects = [],
  commonjsDialects = [],
  exclude = [],
} = config

const relativeExclude = exclude.map(e => `../${e}`)

const recommended: Record<string, any> = {
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

const build = (): Record<string, any> => ({
  extends:
    config.project === undefined
      ? '../tsconfig.json'
      : join('..', config.project),
  compilerOptions: {
    target:
      readTypescriptConfig().options.target === undefined
        ? 'es2022'
        : undefined,
    rootDir: '../src',
    module: 'nodenext',
    moduleResolution: 'nodenext',
  },
})

const commonjs = (dialect: string): Record<string, any> => {
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

const esm = (dialect: string): Record<string, any> => {
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

mkdirpSync('.tshy')
const writeConfig = (name: string, data: Record<string, any>) =>
  writeFileSync(
    `.tshy/${name}.json`,
    JSON.stringify(data, null, 2) + '\n'
  )

console.debug(chalk.cyan.dim('writing tsconfig files...'))
if (config.project === undefined && !existsSync('tsconfig.json')) {
  console.debug('using recommended tsconfig.json')
  writeConfig('../tsconfig', recommended)
} else {
  if (dialects.length > 1) preventVerbatimModuleSyntax()
  console.debug('using existing tsconfig.json')
}
for (const f of readdirSync('.tshy')) {
  unlinkSync(resolve('.tshy', f))
}
writeConfig('build', build())
if (dialects.includes('commonjs')) {
  writeConfig('commonjs', commonjs('cjs'))
  for (const d of commonjsDialects) {
    writeConfig(d, commonjs(d))
  }
}
if (dialects.includes('esm')) {
  writeConfig('esm', esm('esm'))
  for (const d of esmDialects) {
    writeConfig(d, esm(d))
  }
}
