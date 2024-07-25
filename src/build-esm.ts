import chalk from 'chalk'
import { spawn } from 'node:child_process'
import { relative, resolve } from 'node:path'
import buildFail, { type BuildResult } from './build-fail.js'
import config from './config.js'
import * as console from './console.js'
import ifExist from './if-exist.js'
import polyfills from './polyfills.js'
import setFolderDialect from './set-folder-dialect.js'
import './tsconfig.js'
import tsc from './which-tsc.js'

const node = process.execPath
const { esmDialects = [] } = config

const isBuildResult = (x: any): x is BuildResult => {
  return x && typeof x === 'object' && 'esmDialect' in x && 'code' in x
}

export const buildESM = async () => {
  setFolderDialect('src', 'esm')

  const buildPromises = esmDialects.map(esmDialect => new Promise<BuildResult>((resolve, reject) => {
    const pf = polyfills.get(esmDialect);
    console.debug(chalk.cyan.dim('building ' + esmDialect))
    const child = spawn(node, [tsc, '-p', `.tshy/${esmDialect}.json`], {
      stdio: 'inherit',
    })

    child.on('close', (code, signal) => {
      if (code === 0) {
        resolve({ esmDialect, code });
      } else {
        reject({ esmDialect, code, signal });
      }
    })
  }))

  try {
    const results = await Promise.all(buildPromises); // Wait for all promises to resolve
    results.forEach(({ esmDialect }) => {
      const pf = polyfills.get(esmDialect)
      setFolderDialect('.tshy-build/' + esmDialect, 'esm')
      for (const [override, orig] of pf?.map.entries() ?? []) {
        const stemFrom = resolve(
          `.tshy-build/${esmDialect}`,
          relative(resolve('src'), resolve(override)),
        ).replace(/\.mts$/, '')
        const stemTo = resolve(
          `.tshy-build/${esmDialect}`,
          relative(resolve('src'), resolve(orig)),
        ).replace(/\.tsx?$/, '')
        ifExist.unlink(`${stemTo}.js.map`)
        ifExist.unlink(`${stemTo}.d.ts.map`)
        ifExist.rename(`${stemFrom}.mjs`, `${stemTo}.js`)
        ifExist.rename(`${stemFrom}.d.mts`, `${stemTo}.d.ts`)
      }
      console.error(chalk.cyan.bold('built ' + esmDialect))
    });
  } catch (error) {
    setFolderDialect('src');
    if (isBuildResult(error)) {
      return buildFail(error)
    }
    console.error(chalk.cyan.bold('failed to build'))
  }

  setFolderDialect('src')
}
