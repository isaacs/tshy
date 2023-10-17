// the modules like -cjs.cts that override a module at .ts
import chalk from 'chalk'
import config from './config.js'
import * as console from './console.js'
import sources from './sources.js'

const { esmDialects = [], commonjsDialects = [] } = config

export class PolyfillSet {
  type: 'esm' | 'commonjs'
  name: string
  map = new Map<string, string>()
  constructor(type: 'esm' | 'commonjs', name: string) {
    this.type = type
    this.name = name
  }
  addFile(f: string, sources: Set<string>) {
    const dotts = this.type === 'commonjs' ? 'cts' : 'mts'
    const ending = `-${this.name}.${dotts}`
    if (!f.endsWith(ending)) return
    const ts = f.substring(0, f.length - ending.length) + '.ts'
    const tsx = ts + 'x'
    if (sources.has(ts)) this.map.set(f, ts)
    else if (sources.has(tsx)) this.map.set(f, tsx)
  }
  [Symbol.for('nodejs.util.inspect.custom')]() {
    return [this.name, this.map]
  }
}

const polyfills = new Map<string, PolyfillSet>([
  ['cjs', new PolyfillSet('commonjs', 'cjs')],
])
for (const d of commonjsDialects)
  polyfills.set(d, new PolyfillSet('commonjs', d))
for (const d of esmDialects)
  polyfills.set(d, new PolyfillSet('esm', d))

for (const f of sources) {
  for (const pf of polyfills.values()) {
    pf.addFile(f, sources)
  }
}

// delete any polyfill types that have no entries
for (const [name, pf] of polyfills.entries()) {
  if (pf.map.size === 0) polyfills.delete(name)
}

if (polyfills.size) {
  console.debug(chalk.cyan.dim('polyfills detected'), polyfills)
}

export default polyfills
