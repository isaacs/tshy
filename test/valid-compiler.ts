import t from 'tap'

import validCompiler from '../src/valid-compiler.js'

t.equal(validCompiler('hello'), false)
t.equal(validCompiler({ hello: 'world' }), false)
t.equal(validCompiler('tsgo'), true)
t.equal(validCompiler('tsc'), true)
t.equal(validCompiler(), true)
