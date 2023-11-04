/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/prevent-verbatim-module-syntax.ts > TAP > is set, many worries > must match snapshot 1`] = `
[31m[1mverbatimModuleSyntax detected[22m[39m
verbatimModuleSyntax is incompatible with multi-dialect builds. Either remove
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
