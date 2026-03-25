import t from 'tap'
const failures: string[] = []
const exits = t.capture(process, 'exit', () => false).args
const { default: validProject } = await t.mockImport<
  typeof import('../src/valid-project.js')
>('../src/valid-project.js', {
  '../src/fail.js': (msg: string) => failures.push(msg),
})
t.equal(validProject('asdf'), false)
t.strictSame(exits(), [[1]])
t.strictSame(failures, [
  'tshy.project must point to a tsconfig file on disk, got: "asdf"',
])
const dir = t.testdir({ 'tsconfig.json': JSON.stringify({}) })
t.equal(validProject(dir + '/tsconfig.json'), true)
