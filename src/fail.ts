import chalk from 'chalk'
import * as console from './console.js'
export const fail = (message: string, er?: Error) => {
  console.error(chalk.red.bold(message))
  if (er) console.error(er.message)
  console.print()
}
