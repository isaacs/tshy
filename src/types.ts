import type {
  ConditionalValue,
  ExportsSubpaths,
  Imports,
} from 'resolve-import'

export type TshyConfig = {
  exports?: Record<string, TshyExport>
  dialects?: Dialect[]
  selfLink?: boolean
  main?: boolean
  commonjsDialects?: string[]
  esmDialects?: string[]
  project?: string
  exclude?: string[]
}

export type Dialect = 'commonjs' | 'esm'

export type ExportDetail = {
  default: string
  [k: string]: string
}

export type TshyExport = ConditionalValue

export type Package = {
  name: string
  version: string
  main?: string
  types?: string
  type?: 'module' | 'commonjs'
  bin?: string | Record<string, string>
  exports?: ExportsSubpaths
  tshy?: TshyConfig
  imports?: Imports
  [k: string]: any
}

export type FailureReasonCallback = (reason: string) => void
