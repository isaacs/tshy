import { join } from 'path/posix'
import { resolveExport } from './resolve-export.js'
import { Export } from './types.js'

export default (exp: any): exp is Export => {
  const i = resolveExport(exp, 'import')
  const r = resolveExport(exp, 'require')
  if (i && join(i).startsWith('src/')) return false
  if (r && join(r).startsWith('src/')) return false
  return true
}
