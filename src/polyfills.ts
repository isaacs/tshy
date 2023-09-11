// the modules like -cjs.cts that override a module at .ts
import sources from './sources.js'
import chalk from 'chalk'

const getPolyfills = (sources: Set<string>): Map<string, string> =>
  new Map(
    [...sources]
      .filter(
        f =>
          f.endsWith('-cjs.cts') &&
          sources.has(f.replace(/-cjs\.cts$/, '.ts'))
      )
      .map(f => [f, f.replace(/-cjs\.cts$/, '.ts')])
  )

const polyfills = getPolyfills(sources)
if (polyfills.size) {
  console.error(chalk.cyan.dim('polyfills detected'), polyfills)
}

export default getPolyfills(sources)
