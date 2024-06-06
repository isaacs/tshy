import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { rimrafSync } from 'rimraf'
import t from 'tap'

t.test('imports linking', async t => {
  const require = createRequire(import.meta.url)

  // make sure one of them doesn't already have a scripts block

  for (const i of [
    'imports',
    'imports-with-star',
    'basic',
    'basic-imports-only-deps',
    'basic-custom-project',
  ]) {
    t.test(i, async t => {
      // keep the pjs unmodified
      const f = fileURLToPath(
        new URL(`./fixtures/${i}/package.json`, import.meta.url)
      )
      const dist = fileURLToPath(
        new URL(`./fixtures/${i}/dist`, import.meta.url)
      )
      const pj = JSON.parse(readFileSync(f, 'utf8'))
      t.teardown(() => {
        writeFileSync(f, JSON.stringify(pj, null, 2) + '\n')
        rimrafSync(dist)
      })

      t.chdir(
        fileURLToPath(new URL('./fixtures/' + i, import.meta.url))
      )
      await t.mockImport('../dist/esm/index.js')
      const logs = t.capture(console, 'log').args
      const { test: testESM } = await import(
        `./fixtures/${i}/dist/esm/index.js`
      )
      const {
        test: testCJS,
      } = require(`./fixtures/${i}/dist/commonjs/index.js`)
      await testESM()
      t.strictSame(
        logs(),
        i.startsWith('basic')
          ? [['hello']]
          : [['pkg exports', 'node esm'], ['node esm']]
      )
      await testCJS()
      t.strictSame(
        logs(),
        i.startsWith('basic')
          ? [['hello']]
          : [['pkg exports', 'node esm'], ['node cjs']]
      )
    })
  }
})
