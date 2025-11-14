// find the location of the tsc binary
// This is necessary because pnpm install trees don't expose binaries
// of meta-deps, and it's nicer to not require that the tshy user has
// a dep on typescript directly if they don't need it otherwise.
// However, if they DO have a direct dep on typescript, then load the
// tsc from their local node_modules/.bin/tsc location.
import { resolveImport } from 'resolve-import'
import { fileURLToPath } from 'url'

const resolve = async () =>
  await resolveImport('typescript', process.cwd() + '/x').catch(() =>
    resolveImport('typescript', import.meta.url),
  )

export default fileURLToPath(new URL('../bin/tsc', await resolve()))
