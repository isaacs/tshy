import { resolve } from 'path'
import t from 'tap'

t.test('no bin, no chmod', async t => {
  const chmodSync = t.captureFn((_: string, __: number) => {})
  const { default: bins } = (await t.mockImport(
    '../dist/esm/bins.js',
    {
      '../dist/esm/package.js': { default: {} },
      'node:fs': { chmodSync },
    }
  )) as typeof import('../dist/esm/bins.js')
  bins()
  t.strictSame(chmodSync.args(), [])
})

t.test('chmod bin string', async t => {
  const chmodSync = t.captureFn((_: string, __: number) => {})
  const { default: bins } = (await t.mockImport(
    '../dist/esm/bins.js',
    {
      '../dist/esm/package.js': { default: { bin: './bin.js' } },
      'node:fs': { chmodSync },
    }
  )) as typeof import('../dist/esm/bins.js')
  bins()
  t.strictSame(chmodSync.args(), [[resolve('./bin.js'), 0o755]])
})

t.test('chmod bin object', async t => {
  const chmodSync = t.captureFn((_: string, __: number) => {})
  const { default: bins } = await t.mockImport(
    '../dist/esm/bins.js',
    {
      '../dist/esm/package.js': {
        default: { bin: { a: './a.js', b: './b.js' } },
      },
      'node:fs': { chmodSync },
    }
  )
  bins()
  t.strictSame(chmodSync.args(), [
    [resolve('./a.js'), 0o755],
    [resolve('./b.js'), 0o755],
  ])
})
