import assert from 'assert'
import memoize from '../memoize'

describe('memoize', () => {

    it('executes fn only once', () => {
        const memo = memoize(() => Math.random())
        assert(memo() === memo())
    })

    it('resolves async fns', () => {
        const memo = memoize(() => Promise.resolve(Math.random()))
        Promise.all([memo(), memo()])
            .then(([a, b]) => assert(a === b) && assert(a instanceof Number))
    })

})