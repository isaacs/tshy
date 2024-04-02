// find the location of the tsc binary
// This is necessary because pnpm install trees don't expose binaries
// of meta-deps, and it's nicer to not require that the tshy user has
// a dep on typescript directly if they don't need it otherwise.
import { resolveImport } from 'resolve-import'
import { fileURLToPath } from 'url'

export default fileURLToPath(
  new URL(
    '../bin/tsc',
    await resolveImport('typescript', import.meta.url)
  )
)
