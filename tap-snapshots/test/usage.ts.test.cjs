/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/usage.ts > TAP > no error > no link > must match snapshot 1`] = `
Usage: tshy [--help]
  --help -h   Print this message and exit.
  --watch -w  Watch files in ./src and build when they change.

Default behavior: build project according to tshy config in package.json

See the docs for more information: https://github.com/isaacs/tshy
`

exports[`test/usage.ts > TAP > no error > with link > must match snapshot 1`] = `
Usage: tshy [--help]
  --help -h   Print this message and exit.
  --watch -w  Watch files in ./src and build when they change.

Default behavior: build project according to tshy config in package.json

See the docs for more information: ]8;;https://github.com/isaacs/tshy\\https://github.com/isaacs/tshy]8;;\\
`

exports[`test/usage.ts > TAP > with error > no link > must match snapshot 1`] = `
Usage: tshy [--help]
  --help -h   Print this message and exit.
  --watch -w  Watch files in ./src and build when they change.

Default behavior: build project according to tshy config in package.json

See the docs for more information: https://github.com/isaacs/tshy
[31m[1merror string[22m[39m
`

exports[`test/usage.ts > TAP > with error > with link > must match snapshot 1`] = `
Usage: tshy [--help]
  --help -h   Print this message and exit.
  --watch -w  Watch files in ./src and build when they change.

Default behavior: build project according to tshy config in package.json

See the docs for more information: ]8;;https://github.com/isaacs/tshy\\https://github.com/isaacs/tshy]8;;\\
[31m[1merror string[22m[39m
`
