/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/polyfills.ts > TAP > must match snapshot 1`] = `
Map(3) {
  'cjs' => [
    'cjs',
    Map(2) {
      './src/foo-cjs.cts' => './src/foo.ts',
      './src/jsx-cjs.cts' => './src/jsx.tsx'
    }
  ],
  'blah' => [ 'blah', Map(1) { './src/foo-blah.cts' => './src/foo.ts' } ],
  'deno' => [ 'deno', Map(1) { './src/foo-deno.mts' => './src/foo.ts' } ]
}
`
