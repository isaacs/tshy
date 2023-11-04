import t from 'tap'
import readTypescriptConfig from '../src/read-typescript-config.js'

const config = readTypescriptConfig()
t.equal(config, readTypescriptConfig(), 'cached')
