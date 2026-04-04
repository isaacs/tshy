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
    'commonjs',
    Map(2) {
      './src/foo-cjs.cts' => './src/foo.ts',
      './src/jsx-cjs.cts' => './src/jsx.tsx'
    }
  ],
  'commonjs-blah' => [
    'blah',
    'commonjs',
    Map(1) { './src/foo-blah.cts' => './src/foo.ts' }
  ],
  'esm-deno' => [ 'deno', 'esm', Map(1) { './src/foo-deno.mts' => './src/foo.ts' } ]
}
`
