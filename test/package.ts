import t from 'tap'

t.test('load package successfully', async t => {
  const { default: pkg } = await t.mockImport(
    '../dist/esm/package.js'
  )
  t.equal(pkg.name, 'tshy')
  t.equal(pkg.type, 'module')
})

t.test('unsuccessfully fails build', async t => {
  const exits = t.capture(process, 'exit').args
  t.chdir(t.testdir())
  let failed = false
  await t.mockImport('../dist/esm/package.js', {
    '../dist/esm/fail.js': () => (failed = true),
  })
  t.strictSame(exits(), [[1]])
  t.equal(failed, true)
})

t.test('fail if the package.json is not an object', async t => {
  const exits = t.capture(process, 'exit').args
  t.chdir(
    t.testdir({
      'package.json': '[null, 1, "asdf"]',
    })
  )
  let failed = false
  await t.mockImport('../dist/esm/package.js', {
    '../dist/esm/fail.js': () => (failed = true),
  })
  t.strictSame(exits(), [[1]])
  t.equal(failed, true)
})
