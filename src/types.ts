export type TshyConfig = {
  exports?: Record<string, TshyExport>
  dialects?: Dialect[]
  selfLink?: boolean
}

export type Dialect = 'commonjs' | 'esm'

export type ExportDetail = {
  default: string
  [k: string]: string
}

export type TshyExport =
  | string
  | ({ types?: string; import?: string; require?: string } & (
      | { import: string }
      | { require: string }
    ))
  | ({
      types?: string
      import?: ExportDetail
      require?: ExportDetail
    } & ({ import: ExportDetail } | { require: ExportDetail }))

export type Package = {
  name: string
  version: string
  type?: 'module'
  bin?: string | Record<string, string>
  exports?: Record<string, Export>
  tshy?: TshyConfig
  imports?: Record<string, any>
  [k: string]: any
}

// VERY limited subset of the datatypes "exports" can be
// but we're only writing our flavor, so it's fine.
export type Export =
  | string
  | {
      import?: Export
      require?: Export
      types?: Export
      default?: Export
    }
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
