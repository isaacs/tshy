// the modules like -cjs.cts that override a module at .ts
import chalk from 'chalk'
import sources from './sources.js'

const target = (f: string, sources: Set<string>) => {
  const ts = f.replace(/\-cjs\.cts$/, '.ts')
  const tsx = f.replace(/\-cjs\.cts$/, '.tsx')
  return sources.has(ts) ? ts : sources.has(tsx) ? tsx : undefined
}

const getPolyfills = (sources: Set<string>): Map<string, string> =>
  new Map(
    [...sources]
      .filter(f => f.endsWith('-cjs.cts'))
      .map(f => [f, target(f, sources)])
      .filter(([_, target]) => !!target) as [string, string][]
  )

const polyfills = getPolyfills(sources)
if (polyfills.size) {
  console.error(chalk.cyan.dim('polyfills detected'), polyfills)
}

export default getPolyfills(sources)
