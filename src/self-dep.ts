// link the package folder into ./target/node_modules/<pkgname>
import { symlinkSync } from 'fs'
import { mkdirpSync } from 'mkdirp'
import { dirname, relative, resolve } from 'path'
import { rimrafSync } from 'rimraf'
import { Package } from './types.js'

const dirsMade = new Map<string, string>()

export const link = (pkg: Package, where: string) => {
  if (!pkg.name) return
  const dest = resolve(where, 'node_modules', pkg.name)
  const dir = dirname(dest)
  const src = relative(dir, process.cwd())
  const made = mkdirpSync(dir)
  if (made) dirsMade.set(dest, made)
  symlinkSync(src, dest)
}

export const unlink = (pkg: Package, where: string) => {
  if (!pkg.name) return
  const dest = resolve(where, 'node_modules', pkg.name)
  rimrafSync(dest)
  const made = dirsMade.get(dest)
  if (made) rimrafSync(made)
}
