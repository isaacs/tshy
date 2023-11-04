// read the actual configuration that tsc is using
// Note: cannot just use JSON.parse, because ts config files
// are jsonc.
import { resolve } from 'path'
import ts from 'typescript'
const { readFile } = ts.sys

let parsedTsConfig: ts.ParsedCommandLine | undefined = undefined
export default () => {
  if (parsedTsConfig) return parsedTsConfig
  const configPath = resolve('tsconfig.json')
  const readResult = ts.readConfigFile(configPath, readFile)
  return (parsedTsConfig = ts.parseJsonConfigFileContent(
    readResult.config,
    ts.sys,
    process.cwd()
  ))
}
