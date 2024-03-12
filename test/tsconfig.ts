import {
  readFileSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'fs'
import { resolve } from 'path'
import t from 'tap'

const cwd = process.cwd()
t.after(() => process.chdir(cwd))
const dir = t.testdir({
  'package.json': JSON.stringify({
    tshy: {
      exclude: ['./src/**/*.test.ts'],
      esmDialects: ['deno'],
      commonjsDialects: ['webpack'],
    },
  }),
  src: {
    'index.ts': '',
    'index-cjs.cts': '',
    'index-deno.mts': '',
    'index-webpack.mts': '',
  },
})
process.chdir(dir)

t.test('with tsconfig.json file', async t => {
  let { generateTsConfigFiles } = await t.mockImport(
    '../dist/esm/tsconfig.js'
  )

  await generateTsConfigFiles()

  for (const f of [
    'tsconfig.json',
    '.tshy/build.json',
    '.tshy/commonjs.json',
    '.tshy/esm.json',
  ]) {
    t.matchSnapshot(
      JSON.parse(readFileSync(resolve(dir, f), 'utf8')),
      f + ' generate everything'
    )
  }

  writeFileSync(
    resolve(dir, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        yolo: '🍑',
        this_data: 'is preserved',
      },
    })
  )
  unlinkSync(resolve(dir, '.tshy/build.json'))
  writeFileSync(
    resolve(dir, '.tshy/esm.json'),
    'not even json, this gets clobbered'
  )

  await generateTsConfigFiles()

  for (const f of [
    'tsconfig.json',
    '.tshy/build.json',
    '.tshy/commonjs.json',
    '.tshy/esm.json',
    '.tshy/deno.json',
    '.tshy/webpack.json',
  ]) {
    t.matchSnapshot(
      JSON.parse(readFileSync(resolve(dir, f), 'utf8')),
      f
    )
  }
})

t.test('with custom project tsconfig name', async t => {
  renameSync(
    resolve(dir, 'tsconfig.json'),
    resolve(dir, 'custom.json')
  )

  writeFileSync(
    resolve(dir, 'package.json'),
    JSON.stringify({
      tshy: {
        project: 'custom.json',
        esmDialects: ['deno'],
        commonjsDialects: ['webpack'],
      },
    })
  )

  let { generateTsConfigFiles } = await t.mockImport(
    '../dist/esm/tsconfig.js'
  )
  await generateTsConfigFiles(console as any)

  t.throws(() => statSync(resolve(dir, 'tsconfig.json')), {
    code: 'ENOENT',
  })

  for (const f of [
    'custom.json',
    '.tshy/build.json',
    '.tshy/commonjs.json',
    '.tshy/esm.json',
    '.tshy/deno.json',
    '.tshy/webpack.json',
  ]) {
    t.matchSnapshot(
      JSON.parse(readFileSync(resolve(dir, f), 'utf8')),
      f
    )
  }
})
