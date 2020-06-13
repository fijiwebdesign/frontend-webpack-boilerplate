import '../scss/app.scss';
import assert from 'assert'

import memoize from './memoize'

const memo = memoize(() => Math.random())

assert(memo() === memo())