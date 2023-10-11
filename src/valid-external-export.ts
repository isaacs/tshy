import { join } from 'path/posix'
import type { ConditionalValueObject } from 'resolve-import'
import { resolveExport } from './resolve-export.js'

export default (exp: any): exp is ConditionalValueObject => {
  const i = resolveExport(exp, ['import'])
  const r = resolveExport(exp, ['require'])
  if (i && join(i).startsWith('src/')) return false
  if (r && join(r).startsWith('src/')) return false
  return true
}
