export const resolveExport = (
  exp: any,
  m: 'import' | 'require'
): string | undefined | null => {
  if (typeof exp === 'string') return exp
  if (typeof exp !== 'object') return undefined
  if (exp === null) return exp
  if (Array.isArray(exp)) {
    for (const e of exp) {
      const u = resolveExport(e, m)
      if (u || u === null) return u
    }
    return undefined
  }
  if (exp[m]) return resolveExport(exp[m], m)
  if (exp.node) return resolveExport(exp.node, m)
  if (exp.default) return resolveExport(exp.default, m)
}
