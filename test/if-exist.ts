import { readdirSync } from 'fs'
import t from 'tap'
import ifExist from '../src/if-exist.js'

const dir = t.testdir({
  a: 'a',
  b: 'b',
})

ifExist.unlink(dir + '/x')
ifExist.rename(dir + '/x', dir + '/z')

t.strictSame(new Set(readdirSync(dir)), new Set(['a', 'b']))

ifExist.unlink(dir + '/a')
ifExist.rename(dir + '/b', dir + '/c')

t.strictSame(readdirSync(dir), ['c'])
