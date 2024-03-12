/**
 * Resolves the exported value from a module export object.
 *
 * Checks for string exports, null exports, array exports by recursing,
 * and object exports with special keys like 'node' and 'default'.
 *
 * Returns the first valid resolved export value or undefined if none found.
 */
export const resolveExport = (
  exp: any,
  conditions: string[]
): string | undefined | null => {
  if (typeof exp === 'string') return exp
  if (typeof exp !== 'object') return undefined
  if (exp === null) return exp
  if (Array.isArray(exp)) {
    for (const e of exp) {
      const u = resolveExport(e, conditions)
      if (u || u === null) return u
    }
    return undefined
  }
  const conds = [...conditions, 'node', 'default']
  for (const [c, e] of Object.entries(exp)) {
    if (conds.includes(c)) {
      const u = resolveExport(e, conditions)
      if (u || u === null) return u
    }
  }
}
