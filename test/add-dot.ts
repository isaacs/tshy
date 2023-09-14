import t from 'tap'
import addDot from '../src/add-dot.js'

t.equal(addDot('./foo'), './foo')
t.equal(addDot('foo'), './foo')
