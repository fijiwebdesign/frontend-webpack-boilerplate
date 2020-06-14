import assert from 'assert'
import memoize from '../memoize'

const barMemo = memoize(() => Math.random())

const memoizePropDecorator = (target, propName, descriptor) => {
    const _descripter = Object.getOwnPropertyDescriptor(target, propName)
    console.log('decorator', {target, propName, descriptor, _descripter })
    const { initializer, get } = descriptor
    const memo = memoize(() => initializer ? initializer()() : (get && get()))
    return {
        get() {
            console.log('memoizePropDecorator get()', memo())
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

    @memoizePropDecorator foozz = () => Math.random()

    @memoizePropDecorator nully

    userId = 1
    
    @memoizePropDecorator get user() {
        return new User({ id: this.userId })
    }
    
    // import { belongsTo } from './ModelRelationship'
    // @belongsTo(User, { foreignKey: 'userId', key: 'id' }) user

}

class User extends Model {}

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

    it('decorates getter', () => {
        const model = new Model()
        assert(model.fooz === model.fooz)
        console.log('model.fooz', model.fooz)
        assert(typeof model.fooz === 'number')
    })
    
    it('decorates initializer', () => {
        const model = new Model()
        assert(model.foozz === model.foozz)
        console.log('model.foozz', model.foozz)
        assert(typeof model.foozz === 'number')
    })

    it('decorates uninitialized', () => {
        const model = new Model()
        assert(model.nully === model.nully)
        console.log('model.nully', model.nully)
        assert(model.nully === undefined)
    })

})