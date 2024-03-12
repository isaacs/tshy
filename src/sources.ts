import { readdirSync } from 'fs'
import { join } from 'path/posix'

/**
 * Recursively gets a list of all source files in the given directory and subdirectories.
 *
 * @param dir - The directory to search in. Defaults to './src'.
 * @returns An array of all source files found recursively in the given directory.
 */
export const getSourcesFrom = (dir = 'src'): string[] => {
  const sources: string[] = []
  const entries = readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const j = `./${join(dir, e.name)}`
    if (e.isFile()) sources.push(j)
    else if (e.isDirectory()) {
      sources.push(...getSourcesFrom(j))
    }
  }
  return sources
}

let sources: Set<string> | undefined

/**
 * The list of sources in ./src
 */
export const getSrcFiles = () =>
  (sources ??= new Set(getSourcesFrom()))

export default getSrcFiles
