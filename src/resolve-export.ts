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
