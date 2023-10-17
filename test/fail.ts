import t from 'tap'

t.capture(process, 'exit', (...a: any[]) =>
  calls.push(['process.exit', a])
)
const calls: [string, any[]][] = []

const { default: fail } = (await t.mockImport('../dist/esm/fail.js', {
  '../dist/esm/console.js': {
    error: (...a: any[]) => calls.push(['console.error', a]),
    print: (...a: any[]) => calls.push(['console.print', a]),
  },
})) as typeof import('../dist/esm/fail.js')

fail('no error')
fail('with error', { message: 'error message' } as unknown as Error)
t.matchSnapshot(calls)
