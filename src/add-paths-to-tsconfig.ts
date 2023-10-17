// add/update paths section in tsconfig.json if tshy.imports present

import { readFileSync, writeFileSync } from 'fs'
import config from './config.js'
import fail from './fail.js'
const { imports } = config

export const tryParse = (s: string) => {
  try {
    return JSON.parse(s)
  } catch (er) {
    fail('could not parse tsconfig.json to add "paths"', er as Error)
    return process.exit(1)
  }
}

export const addToObject = (
  tsconfig: Record<string, any> & {
    paths?: Record<string, string[]>
  }
) => {
  if (!imports) return tsconfig
  return {
    ...tsconfig,
    paths: {
      ...tsconfig.paths,
      ...Object.fromEntries(
        Object.entries(imports).map(([k, v]) => [k, [v]])
      ),
    },
  }
}

export const addToFile = () => {
  if (!imports) return
  const tsconfig = tryParse(readFileSync('tsconfig.json', 'utf8'))
  if (!tsconfig) {
    // failed
    return
  }
  writeFileSync(
    'tsconfig.json',
    JSON.stringify(addToObject(tsconfig), null, 2) + '\n'
  )
}
