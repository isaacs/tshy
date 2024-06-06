/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/config.ts > TAP > basic parsing cases > {"config":{"dialects":"yolo"},"sources":[],"ok":false} > must match snapshot 1`] = `
tshy.dialects must be an array including "esm" and/or "commonjs", got: "yolo"
`

exports[`test/config.ts > TAP > basic parsing cases > {"config":{"exports":{"./blah":{"require":"./src/notallowed"}}},"sources":[],"ok":false} > must match snapshot 1`] = `
tshy.exports ./blah unbuilt exports must not be in ./src, and exports in src must be string values. got: {"require":"./src/notallowed"}
`

exports[`test/config.ts > TAP > basic parsing cases > {"config":{"imports":"blah"},"sources":[],"ok":false} > must match snapshot 1`] = `
invalid imports module specifier: 0
`

exports[`test/config.ts > TAP > basic parsing cases > {"config":{"imports":["blah"]},"sources":[],"ok":false} > must match snapshot 1`] = `
invalid imports module specifier: 0
`

exports[`test/config.ts > TAP > basic parsing cases > {"config":{"main":"blah"},"sources":[],"ok":false} > must match snapshot 1`] = `
tshy.main must be a boolean value if specified, got: blah
`

exports[`test/config.ts > TAP > basic parsing cases > {"config":{"project":"thisFileDoesNotExist.json"},"sources":[],"ok":false} > must match snapshot 1`] = `
tshy.project must point to a tsconfig file on disk, got: "thisFileDoesNotExist.json"
`
