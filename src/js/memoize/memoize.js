const memoize = fn => {
    let value
    return () => {
        if (!value) {
            value = fn()
        }
        return value
    }
}

export default memoize