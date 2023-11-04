// prevent the use of verbatimModuleSyntax: true when
// more than one dialect is in use, since this cannot ever
// be made to work in a hybrid context.
// Note: cannot just use JSON.parse, because ts config files
// are jsonc.
import * as console from './console.js'
import fail from './fail.js'
import readTypescriptConfig from './read-typescript-config.js'

export default () => {
  const config = readTypescriptConfig()
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
