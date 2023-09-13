// only print the logs if it fails, or if TSHY_VERBOSE is set

let verbose = parseInt(process.env.TSHY_VERBOSE || '0')

const errors: any[][] = []
export const error = (...a: any[]) => {
  if (verbose >= 1) console.error(...a)
  else errors.push(a)
}
export const debug = (...a: any[]) => {
  if (verbose >= 2) console.error(...a)
  else errors.push(a)
}

// we only print stdout on success anyway
export const log = (...a: any[]) => {
  if (verbose >= 1) console.log(...a)
}

export const print = () => {
  for (const a of errors) {
    console.error(...a)
  }
  errors.length = 0
}
