import assert from 'assert'
import memoize from '../memoize'

const barMemo = memoize(() => Math.random())

const memoizePropDecorator = (target, propName, descriptor) => {
    const _descripter = Object.getOwnPropertyDescriptor(target, propName)
    console.log('decorator', {target, propName, descriptor, _descripter })
    const memo = memoize(() => descriptor.get())
    return {
        get() {
            console.log('memoizePropDecorator value', memo())
            return memo()
        } 
    }
}

class Model {

    get bar() {
        return barMemo()
    }

    barz = memoize(() => Math.random())

    @memoizePropDecorator get fooz() {
        console.log('get fooz!!!')
        return Math.random()
    }

    @memoizePropDecorator get doNotGet() {
        throw Error('Should lazy load')
    }

}

const memoizeProp = (scope, propName, fn) => {
    const memo = memoize(fn)
    Object.defineProperty(scope.prototype, propName, {
        get() {
            return memo()
        }
    })
}

memoizeProp(Model, 'foo', () => Math.random())

describe('memoizeProp', () => {

    it('prop get executes fn once', () => {
        const model = new Model()
        assert(model.foo === model.foo)
        console.log('model.foo', model.foo)
        assert(typeof model.foo === 'number')
    })

    it('decorates', () => {
        const model = new Model()
        assert(model.fooz === model.fooz)
        console.log('model.fooz', model.fooz)
        assert(typeof model.fooz === 'number')
    })

})