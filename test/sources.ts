import t from 'tap'

const cwd = process.cwd()
t.after(() => process.chdir(cwd))
process.chdir(
  t.testdir({
    src: {
      dir: {
        'file.ts': '',
        link: t.fixture('symlink', './file.ts'),
      },
      'file.ts': '',
    },
  })
)

const { getSrcFiles } = await import('../dist/esm/sources.js')

t.strictSame(
  getSrcFiles(),
  new Set(['./src/dir/file.ts', './src/file.ts'])
)
