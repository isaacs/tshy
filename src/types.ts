export type TshyConfig = {
  exports?: Record<string, TshyExport>
  dialects?: Dialect[]
}

export type Dialect = 'commonjs' | 'esm'

export type TshyExport =
  | string
  | ({ types?: string; import?: string; require?: string } & (
      | { import: string }
      | { require: string }
    ))

export type Package = {
  name: string
  version: string
  type?: 'module'
  bin?: string | Record<string, string>
  exports: Record<string, Export>
  tshy?: TshyConfig
  [k: string]: any
}

// VERY limited subset of the datatypes "exports" can be
// but we're only writing our flavor, so it's fine.
export type Export =
  | string
  | { import?: string; require?: string; types?: string }
  | {
      import?:
        | string
        | {
            types: string
            default: string
          }
      require?:
        | string
        | {
            types: string
            default: string
          }
    }
