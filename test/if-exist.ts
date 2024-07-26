import { readdirSync, rmSync } from 'fs'
import t from 'tap'
import ifExist from '../src/if-exist.js'

const dir = t.testdir({
  a: 'a',
  b: 'b',
})

rmSync(dir + '/x', { recursive: true, force: true })
ifExist.rename(dir + '/x', dir + '/z')

t.strictSame(new Set(readdirSync(dir)), new Set(['a', 'b']))

rmSync(dir + '/a', { recursive: true, force: true })
ifExist.rename(dir + '/b', dir + '/c')

t.strictSame(readdirSync(dir), ['c'])
