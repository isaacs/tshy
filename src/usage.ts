import chalk from 'chalk'
import fail from './fail.js'

export default (err?: string) => {
  const url = 'https://github.com/isaacs/tshy'
  const link =
    chalk.level > 0 ? `\x1b]8;;${url}\x1b\\${url}\x1b]8;;\x1b\\` : url
  console[err ? 'error' : 'log'](`Usage: tshy [--help]
  --help -h   Print this message and exit.
  --watch -w  Watch files in ./src and build when they change.

Default behavior: build project according to tshy config in package.json

See the docs for more information: ${link}`)
  if (err) fail(err)
  process.exit(err ? 1 : 0)
}
