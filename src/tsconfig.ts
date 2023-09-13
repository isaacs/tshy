import chalk from 'chalk'
import { existsSync, writeFileSync } from 'fs'
import { mkdirpSync } from 'mkdirp'

// the commonjs build needs to exclude anything that will be polyfilled
import polyfills from './polyfills.js'

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

const build: Record<string, any> = {
  extends: '../tsconfig.json',
  compilerOptions: {
    rootDir: '../src',
    target: 'es2022',
    module: 'nodenext',
    moduleResolution: 'nodenext',
  },
}

const commonjs: Record<string, any> = {
  extends: './build.json',
  include: ['../src/**/*.ts', '../src/**/*.cts', '../src/**/*.tsx'],
  exclude: ['../src/**/*.mts', ...polyfills.values()].map(
    f => `.${f}`
  ),
  compilerOptions: {
    outDir: '../.tshy-build-tmp/commonjs',
  },
}

const esm: Record<string, any> = {
  extends: './build.json',
  include: ['../src/**/*.ts', '../src/**/*.mts', '../src/**/*.tsx'],
  compilerOptions: {
    outDir: '../.tshy-build-tmp/esm',
  },
}

mkdirpSync('.tshy')
const writeConfig = (name: string, data: Record<string, any>) =>
  writeFileSync(
    `.tshy/${name}.json`,
    JSON.stringify(data, null, 2) + '\n'
  )

console.error(chalk.cyan.dim('writing tsconfig files...'))
if (!existsSync('tsconfig.json'))
  writeConfig('../tsconfig', recommended)
writeConfig('build', build)
writeConfig('commonjs', commonjs)
writeConfig('esm', esm)
