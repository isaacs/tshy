export const resolveExport = (
  exp: any,
  t: 'import' | 'require'
): string | undefined => {
  if (typeof exp === 'string') return exp
  if (!exp || typeof exp !== 'object') return undefined
  if (Array.isArray(exp)) {
    for (const e of exp) {
      const u = resolveExport(e, t)
      if (u) return u
    }
    return undefined
  }
  if (exp[t]) return resolveExport(exp[t], t)
  if (exp.node) return resolveExport(exp.node, t)
  if (exp.default) return resolveExport(exp.default, t)
}
