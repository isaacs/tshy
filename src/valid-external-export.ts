import { join } from 'path/posix'
import type { ConditionalValueObject } from 'resolve-import'
import { resolveExport } from './resolve-export.js'

/**
 * Checks if the given export is a valid external export (not from src/).
 *
 * @param exp - The export to check.
 * @returns Whether the export is a valid external export.
 */
export const isValidExternalExport = (
  exp: any
): exp is ConditionalValueObject => {
  const i = resolveExport(exp, ['import'])
  const r = resolveExport(exp, ['require'])
  if (i && join(i).startsWith('src/')) return false
  if (r && join(r).startsWith('src/')) return false
  return true
}

export default isValidExternalExport
