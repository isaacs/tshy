import t from 'tap'

const cwd = process.cwd()
t.after(() => process.chdir(cwd))
process.chdir(t.testdir({
  src: {
    dir: {
      'file.ts': '',
      link: t.fixture('symlink', './file.ts'),
    },
    'file.ts': '',
  }
}))

const { default: sources } = await import('../dist/esm/sources.js')
t.strictSame(sources, new Set(['./src/dir/file.ts', './src/file.ts']))
