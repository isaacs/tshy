import t from 'tap'

const { default: dialects } = (await t.mockImport(
  '../dist/esm/dialects.js',
  {
    '../dist/esm/config.js': { default: { dialects: ['esm'] } },
  }
)) as typeof import('../dist/esm/dialects.js')
const { default: dialectsEmpty } = (await t.mockImport(
  '../dist/esm/dialects.js',
  {
    '../dist/esm/config.js': { default: {} },
  }
)) as typeof import('../dist/esm/dialects.js')

t.strictSame(dialects, ['esm'])
t.strictSame(dialectsEmpty, ['esm', 'commonjs'])
