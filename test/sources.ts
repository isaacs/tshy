import t from 'tap'

t.chdir(
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

const { default: sources } = await import('../dist/esm/sources.js')
t.strictSame(sources, new Set(['./src/dir/file.ts', './src/file.ts']))
