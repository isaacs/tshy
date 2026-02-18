import type { TshyConfig } from './types.js'

export default (compiler?: unknown): compiler is TshyConfig['compiler'] =>
  compiler === undefined || compiler === 'tsc' || compiler === 'tsgo'
