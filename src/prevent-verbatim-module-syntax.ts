// prevent the use of verbatimModuleSyntax: true when
// more than one dialect is in use, since this cannot ever
// be made to work in a hybrid context.
// Note: cannot just use JSON.parse, because ts config files
// are jsonc.
import { resolve } from 'path'
import ts from 'typescript'
import * as console from './console.js'
import fail from './fail.js'
const { readFile } = ts.sys

export default () => {
  const configPath = resolve('tsconfig.json')
  const readResult = ts.readConfigFile(configPath, readFile)
  const config = ts.parseJsonConfigFileContent(
    readResult.config,
    ts.sys,
    process.cwd()
  )
  if (config.options.verbatimModuleSyntax) {
    fail('verbatimModuleSyntax detected')
    console.error(
      `verbatimModuleSyntax is incompatible with multi-dialect builds. Either remove
this field from tsconfig.json, or set a single dialect in the "dialects"
field in package.json, for example:

{
  "tshy": {
    "dialects": ["esm"]
  }
}

or

{
  "tshy": {
    "dialects": ["commonjs"]
  }
}
`
    )
    console.print()
    process.exit(1)
  }
}
