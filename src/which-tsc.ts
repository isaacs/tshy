// find the location of the tsc binary
// This is necessary because pnpm install trees don't expose binaries
// of meta-deps, and it's nicer to not require that the tshy user has
// a dep on typescript directly if they don't need it otherwise.
// However, if they DO have a direct dep on typescript, then load the
// tsc from their local node_modules/.bin/tsc location.
import { resolveImport } from 'resolve-import'
import { fileURLToPath } from 'url'
import config from './config.js'

const provider = {
  tsgo: '@typescript/native-preview',
  tsc: 'typescript',
} as const

const pjToCompilerPath = {
  tsgo: 'bin/tsgo.js',
  tsc: 'bin/tsc',
} as const

// use theirs if possible, otherwise use tshy's
const resolve = async (pkg: (typeof provider)[keyof typeof provider]) =>
  await resolveImport(pkg + '/package.json', process.cwd() + '/x').catch(
    () => resolveImport(pkg + '/package.json', import.meta.url),
  )

const { compiler = 'tsc' } = config
const provPkg = provider[compiler]

const pjToCompiler = (pj: string) =>
  pj.slice(0, -1 * 'package.json'.length) + pjToCompilerPath[compiler]

export default pjToCompiler(fileURLToPath(await resolve(provPkg)))
