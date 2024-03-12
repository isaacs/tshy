import { resolve } from 'path'
import ts from 'typescript'
import config from './config.js'
const { readFile } = ts.sys

let parsedTsConfig: ts.ParsedCommandLine | undefined = undefined

/**
 * Reads the actual configuration that tsc is using.
 *
 * First checks if the config has already been parsed and cached.
 * If not, it reads the config file path from the config module,
 * reads the raw config using TypeScript's readConfigFile(),
 * parses it with parseJsonConfigFileContent(), and caches it.
 *
 * The parsed config is then returned.
 *
 * Note: cannot just use JSON.parse, because ts config files are jsonc.
 */
export default () => {
  if (parsedTsConfig) return parsedTsConfig
  const configPath = config.project ?? resolve('tsconfig.json')
  const readResult = ts.readConfigFile(configPath, readFile)
  return (parsedTsConfig = ts.parseJsonConfigFileContent(
    readResult.config,
    ts.sys,
    process.cwd()
  ))
}
