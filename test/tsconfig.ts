import { readFileSync, unlinkSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import t from 'tap'

const cwd = process.cwd()
t.after(() => process.chdir(cwd))
process.chdir(
  t.testdir({
    'package.json': JSON.stringify({
      tshy: { esmDialects: ['deno'], commonjsDialects: ['webpack'] },
    }),
    src: {
      'index.ts': '',
      'index-cjs.cts': '',
      'index-deno.mts': '',
      'index-webpack.mts': '',
    },
  })
)

await import('../dist/esm/tsconfig.js')

for (const f of [
  'tsconfig.json',
  '.tshy/build.json',
  '.tshy/commonjs.json',
  '.tshy/esm.json',
]) {
  t.matchSnapshot(
    JSON.parse(readFileSync(resolve(t.testdirName, f), 'utf8')),
    f + ' generate everything'
  )
}

writeFileSync(
  resolve(t.testdirName, 'tsconfig.json'),
  JSON.stringify({
    compilerOptions: {
      yolo: '🍑',
      this_data: 'is preserved',
    },
  })
)
unlinkSync(resolve(t.testdirName, '.tshy/build.json'))
writeFileSync(
  resolve(t.testdirName, '.tshy/esm.json'),
  'not even json, this gets clobbered'
)

await t.mockImport('../dist/esm/tsconfig.js')

for (const f of [
  'tsconfig.json',
  '.tshy/build.json',
  '.tshy/commonjs.json',
  '.tshy/esm.json',
  '.tshy/deno.json',
  '.tshy/webpack.json',
]) {
  t.matchSnapshot(
    JSON.parse(readFileSync(resolve(t.testdirName, f), 'utf8')),
    f
  )
}
