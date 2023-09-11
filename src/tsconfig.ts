import chalk from 'chalk'
import { existsSync, writeFileSync } from 'fs'
import { mkdirpSync } from 'mkdirp'

// the commonjs build needs to exclude anything that will be polyfilled
import polyfills from './polyfills.js'

const recommended: Record<string, any> = {
  compilerOptions: {
    jsx: 'react',
    declaration: true,
    declarationMap: true,
    inlineSources: true,
    esModuleInterop: true,
    forceConsistentCasingInFileNames: true,
    moduleResolution: 'nodenext',
    resolveJsonModule: true,
    skipLibCheck: true,
    sourceMap: true,
    strict: true,
    target: 'es2022',
    module: 'nodenext',
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
  exclude: [...polyfills.values()].map(f => `.${f}`),
  compilerOptions: {
    outDir: '../.tshy-build-tmp/commonjs',
  },
}

const esm: Record<string, any> = {
  extends: './build.json',
  include: ['../src/**/*.ts', '../src/**/*.cts', '../src/**/*.tsx'],
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
