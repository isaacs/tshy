// the modules like -cjs.cts that override a module at .ts
import chalk from 'chalk'
import config from './config.js'
import * as console from './console.js'
import { getSrcFiles } from './sources.js'

const sources = getSrcFiles()
const { esmDialects = [], commonjsDialects = [] } = config

/**
 * PolyfillSet represents a set of polyfill source files for a given module format.
 *
 * Polyfill files must follow the naming convention `*-[dialect].(cts|mts)`.
 *
 * It contains the module format type ('esm' or 'commonjs'),
 * the module name, and a map of polyfill files to their corresponding source files.
 *
 * The addFile method populates the map by extracting the original source file path
 * from polyfill file paths with a known naming convention.
 *
 * The Symbol.for('nodejs.util.inspect.custom') method customizes the inspect output
 * to show the name and map.
 */
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

/**
 * Polyfills map which contains PolyfillSet instances mapping
 * polyfill dialect names to info about their associated source files.
 */
export default polyfills
