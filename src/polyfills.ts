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
  rmap = new Map<string, string>()
  constructor(type: 'esm' | 'commonjs', name: string) {
    this.type = type
    this.name = name
  }
  addFile(f: string, sources: Set<string>) {
    const dotts = this.type === 'commonjs' ? 'cts' : 'mts'
    let ending = `-${this.name}.${dotts}`
    // custom dialects can override both types with a -name.ts file.
    if (
      !f.endsWith(ending) &&
      this.name !== 'cjs' &&
      this.name !== 'esm'
    ) {
      ending = `-${this.name}.ts`
    }
    if (!f.endsWith(ending)) {
      return
    }
    const ts = f.substring(0, f.length - ending.length) + '.ts'
    const tsx = ts + 'x'
    const src =
      sources.has(ts) ? ts
      : sources.has(tsx) ? tsx
      : undefined
    if (!src) {
      return
    }
    this.map.set(f, src)
    this.rmap.set(src, f)
  }
  [Symbol.for('nodejs.util.inspect.custom')]() {
    return [this.name, this.type, this.map]
  }
}

const polyfills = new Map<string, PolyfillSet>([
  ['cjs', new PolyfillSet('commonjs', 'cjs')],
  ['esm', new PolyfillSet('esm', 'esm')],
])
for (const d of commonjsDialects)
  polyfills.set('commonjs-' + d, new PolyfillSet('commonjs', d))
for (const d of esmDialects)
  polyfills.set('esm-' + d, new PolyfillSet('esm', d))

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
