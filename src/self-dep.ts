// link the package folder into ./target/node_modules/<pkgname>
import { readlinkSync, symlinkSync } from 'fs'
import { mkdirpSync } from 'mkdirp'
import { dirname, relative, resolve, sep } from 'path'
import { rimrafSync } from 'rimraf'
import { walkUp } from 'walk-up-path'
import { Package } from './types.js'

const dirsMade = new Map<string, string>()

// if the cwd is in already linked to or living within node_modules,
// then skip the linking, because it's already done.
// This is typically the case in a workspaces setup, and
// creating yet *another* symlink to ourselves in src/node_modules
// will break nx's change detection logic with an ELOOP error.
let inNM: boolean | undefined = undefined

const linkedAlready = (pkg: Package) => {
  if (inNM !== undefined) {
    return inNM
  }

  const cwd = process.cwd()
  const p = `${sep}node_modules${sep}${pkg.name}`.toLowerCase()
  if (cwd.toLowerCase().endsWith(p)) {
    return (inNM = true)
  }

  for (const p of walkUp(cwd)) {
    const link = resolve(p, 'node_modules', pkg.name)
    try {
      const target = resolve(dirname(link), readlinkSync(link))
      if (relative(target, cwd) === '') {
        return (inNM = true)
      }
    } catch {}
  }

  return (inNM = false)
}

export const link = (pkg: Package, where: string) => {
  const selfLink = pkg?.tshy?.selfLink
  if (!pkg.name || selfLink === false || linkedAlready(pkg)) {
    return
  }
  const dest = resolve(where, 'node_modules', pkg.name)
  const dir = dirname(dest)
  const src = relative(dir, process.cwd())
  const made = mkdirpSync(dir)
  if (made) dirsMade.set(dest, made)
  try {
    symlinkSync(src, dest)
  } catch {
    rimrafSync(dest)
    let threw = true
    try {
      symlinkSync(src, dest)
      threw = false
    } finally {
      // best effort if not set explicitly. suppress error with return.
      if (threw && selfLink === undefined) return
    }
  }
}

export const unlink = (pkg: Package, where: string) => {
  if (
    !pkg.name ||
    pkg?.tshy?.selfLink === false ||
    linkedAlready(pkg)
  ) {
    return
  }
  const dest = resolve(where, 'node_modules', pkg.name)
  rimrafSync(dest)
  const made = dirsMade.get(dest)
  if (made) rimrafSync(made)
}
