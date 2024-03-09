// any time the root package.json or any typescript files in src
// are changed/added/removed, run the build
import chalk from 'chalk'
import { spawn } from 'child_process'
import { watch, WatchOptions } from 'chokidar'
import { readFileSync } from 'fs'
import { resolve, sep } from 'path'
import { fileURLToPath } from 'url'
import * as tshyConsole from './console.js'

const pjData = (): string => {
  try {
    return JSON.stringify(
      JSON.parse(readFileSync('./package.json', 'utf8'))
    )
    /* c8 ignore start */
  } catch {
    return 'null'
  }
  /* c8 ignore stop */
}
let lastPJData: string = 'null'

export const options: WatchOptions = {
  persistent: true,
  ignoreInitial: true,
  ignorePermissionErrors: true,
  ignored: path => {
    const r = resolve(path)
    if (r === srcPJ) return true
    if (r === srcNM) return true
    if (r.startsWith(srcNM + sep)) return true
    return false
  },
}

export const srcPJ = resolve('./src/package.json')
export const srcNM = resolve('./src/node_modules')
export const src = resolve('./src')
export const rootPJ = resolve('./package.json')
export const targets = [src, rootPJ]
export const bin = fileURLToPath(
  new URL('./index.js', import.meta.url)
)

export default () => {
  let building = false
  let needRebuild = false
  const watcher = watch(targets, options)
  const build = () => {
    building = true
    needRebuild = false
    const child = spawn(process.execPath, [bin], { stdio: 'inherit' })
    child.on('close', (code, signal) => {
      if (code || signal) tshyConsole.error({ code, signal })
      else console.log(chalk.green('build success'), { code, signal })
      if (needRebuild) build()
      else building = false
    })
  }
  watcher.on('all', (ev, path) => {
    const r = resolve(path)
    if (r === srcPJ) return
    if (r === rootPJ) {
      // check if the data actually changed
      const newData = pjData()
      /* c8 ignore next */
      if (newData === lastPJData) return
      lastPJData = newData
    }
    if (building) {
      if (r !== rootPJ) needRebuild = true
      return
    }
    tshyConsole.debug(chalk.cyan.dim(ev), path)
    build()
  })
  build()
}
