import chalk from 'chalk'
export const fail = (message: string, er?: Error) => {
  console.error(chalk.red.bold(message))
  if (er) console.error(er.message)
}
