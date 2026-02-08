// Remove the .tshy-build folder, but ONLY if
// the "incremental" config value is not set, or if
// it does not contain any tsbuildinfo files.
// If we are in incremental mode, and have tsbuildinfo files,
// then find and remove any files here that do not have a matching
// source file in ./src

import { readdirSync } from 'fs'
import { parse } from 'path'
import { rimraf } from 'rimraf'
import * as console from './console.js'
import readTypescriptConfig from './read-typescript-config.js'

const cleanRemovedOutputs = async (path: string, root: string) => {
  const entries = readdirSync(`${root}/${path}`, {
    withFileTypes: true,
  })
  let sources: Set<string> | undefined = undefined
  try {
    sources = new Set(readdirSync(`src/${path}`))
  } catch {}
  // directory was removed
  if (!sources) {
    return await rimraf(`${root}/${path}`)
  }
  for (const e of entries) {
    const outputFile = `${path}/${e.name}`
    if (e.isDirectory()) {
      await cleanRemovedOutputs(outputFile, root)
      continue
    }
    let { ext, name } = parse(outputFile)
    if (ext === '.map') {
      continue
    }
    if (name.endsWith('.d') && ext.endsWith('ts')) {
      ext = '.d' + ext
      name = name.substring(0, name.length - '.d'.length)
    }

    const inputSearch =
      ext === '.js' || ext === '.d.ts' ? ['.tsx', '.ts']
      : ext === '.mjs' || ext === '.d.mts' ? ['.mts']
      : ext === '.cjs' || ext === '.d.cts' ? ['.cts']
      : []
    inputSearch.push(ext)
    let del = true
    for (const ext of inputSearch) {
      if (sources.has(`${name}${ext}`)) {
        del = false
        break
      }
    }
    if (del) {
      console.debug('removing output file', outputFile)
      await rimraf([`${root}/${outputFile}`, `${root}/${outputFile}.map`])
    }
  }
}

export default async () => {
  const config = readTypescriptConfig()
  if (
    config.compilerOptions.incremental !== true &&
    config.compilerOptions.composite !== true
  ) {
    return await rimraf('.tshy-build')
  }

  let buildInfos: string[] | undefined = undefined
  try {
    buildInfos = readdirSync('.tshy-build/.tshy')
  } catch {}
  if (!buildInfos?.length) {
    return await rimraf('.tshy-build')
  }

  // delete anything that has been removed from src.
  for (const dialect of readdirSync('.tshy-build')) {
    if (dialect === '.tshy') continue
    await cleanRemovedOutputs('.', `.tshy-build/${dialect}`)
  }
}
