import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import t from 'tap'

let failed: string | undefined = undefined
const mockFail = (m: string) => (failed = m)

const exits = t.capture(process, 'exit').args

const mockConfig = {
  imports: {
    '#x': './src/blah.ts',
    '#x/*': './src/blah/*.ts',
  },
}
const { paths: _, ...tsconfig } = JSON.parse(
  readFileSync(
    fileURLToPath(new URL('../tsconfig.json', import.meta.url)),
    'utf8'
  )
)

t.test('add to object', async t => {
  const { addToObject } = (await t.mockImport(
    '../src/add-paths-to-tsconfig.js',
    {
      '../src/config.js': { default: mockConfig },
      '../src/fail.js': { default: mockFail },
    }
  )) as typeof import('../src/add-paths-to-tsconfig.js')
  const { paths } = addToObject(tsconfig)
  t.strictSame(paths, {
    '#x': ['./src/blah.ts'],
    '#x/*': ['./src/blah/*.ts'],
  })
  t.equal(failed, undefined)
  t.strictSame(exits(), [])
})

t.test('add to object, nothing to add', async t => {
  const { addToObject } = (await t.mockImport(
    '../src/add-paths-to-tsconfig.js',
    {
      '../src/config.js': { default: {} },
      '../src/fail.js': { default: mockFail },
    }
  )) as typeof import('../src/add-paths-to-tsconfig.js')
  const added = addToObject(tsconfig)
  t.equal(added, tsconfig, 'no change made')
  t.equal(failed, undefined)
  t.strictSame(exits(), [])
})

t.test('add to file', async t => {
  const dir = t.testdir({
    'tsconfig.json': JSON.stringify(tsconfig),
  })
  const cwd = process.cwd()
  process.chdir(dir)
  t.teardown(() => process.chdir(cwd))

  const { addToFile } = (await t.mockImport(
    '../src/add-paths-to-tsconfig.js',
    {
      '../src/config.js': { default: mockConfig },
      '../src/fail.js': { default: mockFail },
    }
  )) as typeof import('../src/add-paths-to-tsconfig.js')
  addToFile()
  const { paths } = JSON.parse(
    readFileSync(dir + '/tsconfig.json', 'utf8')
  )
  t.strictSame(paths, {
    '#x': ['./src/blah.ts'],
    '#x/*': ['./src/blah/*.ts'],
  })
  t.equal(failed, undefined)
  t.strictSame(exits(), [])
})

t.test('add to file, nothing to add', async t => {
  const dir = t.testdir({
    'tsconfig.json': JSON.stringify(tsconfig),
  })
  const cwd = process.cwd()
  process.chdir(dir)
  t.teardown(() => process.chdir(cwd))

  const { addToFile } = (await t.mockImport(
    '../src/add-paths-to-tsconfig.js',
    {
      '../src/config.js': { default: {} },
      '../src/fail.js': { default: mockFail },
    }
  )) as typeof import('../src/add-paths-to-tsconfig.js')
  addToFile()
  const result = JSON.parse(
    readFileSync(dir + '/tsconfig.json', 'utf8')
  )
  t.strictSame(result, tsconfig, 'no change made')
  t.equal(failed, undefined)
  t.strictSame(exits(), [])
})

t.test('fail to parse', async t => {
  const tsconfigContent = JSON.stringify(tsconfig, null, 2).replace(
    /\{/,
    '{ // comments not supported'
  )
  const dir = t.testdir({
    'tsconfig.json': tsconfigContent,
  })
  const cwd = process.cwd()
  process.chdir(dir)
  t.teardown(() => process.chdir(cwd))

  const { addToFile } = (await t.mockImport(
    '../src/add-paths-to-tsconfig.js',
    {
      '../src/config.js': { default: mockConfig },
      '../src/fail.js': { default: mockFail },
    }
  )) as typeof import('../src/add-paths-to-tsconfig.js')
  addToFile()
  t.equal(
    readFileSync(dir + '/tsconfig.json', 'utf8'),
    tsconfigContent,
    'no change made to file'
  )
  t.type(failed, 'string')
  t.matchSnapshot(failed, 'failure message')
  t.strictSame(exits(), [[1]])
})
