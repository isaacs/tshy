// get the list of sources in ./src

import { readdirSync } from 'fs'
import { join } from 'path/posix'

const getSources = (dir = 'src'): string[] => {
  const sources: string[] = []
  const entries = readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const j = `./${join(dir, e.name)}`
    if (e.isFile()) sources.push(j)
    else if (e.isDirectory()) {
      sources.push(...getSources(j))
    }
  }
  return sources
}

const sources = new Set(getSources())
export default sources
