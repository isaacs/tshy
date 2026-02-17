// read the actual configuration that tsc is using
// reimplemented in this way to avoid pulling in the massive pile
// of CommonJS that is the typescript module, since we really do not
// need most of the logic that it (reasonably) applies when parsing
// configs, just for our purposes.
import { dirname, isAbsolute, resolve } from 'node:path'
import config from './config.js'
import type { ParsedCommandLine } from 'typescript'
import { readFileSync, statSync } from 'node:fs'
import { walkUp } from 'walk-up-path'
import JSON from 'jsonc-simple-parser'

const isFile = (f: string) => {
  try {
    return statSync(f).isFile()
  } catch {
    return false
  }
}

let parsedTsConfig: Record<string, any> & {
  compilerOptions: ParsedCommandLine['options']
}
export default () => {
  const configPath = config.project ?? 'tsconfig.json'
  return (parsedTsConfig ??= parseTsConfig(resolveConfig(configPath)))
}

const resolveConfig = (
  target: string,
  from: string = process.cwd(),
): string => {
  if (isAbsolute(target)) return target
  let local = resolve(from, target)
  if (!isFile(local) && isFile(local + '.json')) local += '.json'
  if (
    isFile(local) ||
    target.startsWith('.\\') ||
    target.startsWith('./')
  ) {
    return local
  }

  // starts with a package name?
  for (const p of walkUp(from)) {
    const found = resolve(p, 'node_modules', target)
    if (isFile(found)) return found
    const pre = resolve(p, 'node_modules', target)
    const foundTsconfig = resolve(pre, 'tsconfig.json')
    if (isFile(foundTsconfig)) return foundTsconfig
    if (isFile(pre + '.json')) return pre + '.json'
  }

  throw new Error('Could not resolve tsconfig file location', {
    cause: {
      target,
      from,
    },
  })
}

const applyExtends = (
  data: Record<string, any>,
  base: Record<string, any>,
) => {
  for (const [key, val] of Object.entries(base)) {
    if (typeof val !== 'object' || Array.isArray(val)) {
      data[key] ??= val
    } else if (!(key in data)) {
      data[key] = val
    } else if (
      typeof data[key] === 'object' &&
      !Array.isArray(data[key])
    ) {
      data[key] = applyExtends(data[key], val)
    }
  }
  return data
}

const parseTsConfig = (configPath: string, seen = new Set<string>()) => {
  try {
    const data = JSON.parse(
      readFileSync(resolveConfig(configPath), 'utf8'),
    )
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('invalid data, expected object', {
        cause: data,
      })
    }
    if (!data.compilerOptions) data.compilerOptions = {}
    if (typeof data.extends === 'string') {
      const ext = resolveConfig(data.extends, dirname(configPath))
      if (!seen.has(ext)) {
        seen.add(ext)
        applyExtends(data, parseTsConfig(ext, seen))
      }
    }
    return data
  } catch (e) {
    throw new Error('Invalid tsconfig file', { cause: e })
  }
}
