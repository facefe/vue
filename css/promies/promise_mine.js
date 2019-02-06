function Promise_mine(func) {
    let self = this
    self.state = 'pending'
    self.data = null
    self.resolveFuncList = []
    self.rejectFuncList = []


    function resolve(data) {
        self.state = 'fulfilled'
        self.asyncdata = data
        self.resolveFuncList.forEach(function (asyncFunc) {
            asyncFunc()

        })
    }

    function reject(data) {
        self.state = 'reject'
        self.asyncdata = data
        self.rejectFuncList.forEach(function (asyncFunc) {
            asyncFunc()

        })
    }
    try {
        func(resolve, reject)
    } catch (e) {
        reject(e)
    }
}

/**
 * 没有考虑kong then 的情况，
 */
Promise_mine.prototype.then = function (func_resolve, func_reject) {
    let self = this
    // 还有链式执行。
    let newP = new Promise_mine(function (res, rej) {
        if (self.state === 'fulfilled') {
            try {
                let newProVal = func_resolve(self.asyncdata)
                // 如果是同步函数,返回值会直接直接返回给 res 
                res(newProVal)
            } catch (d) {
                rej(e)
            }
        }
        if (self.state === 'reject') {
            try {
                let newProVal = func_reject(self.asyncdata)
                res(newProVal)
            } catch (e) {
                rej(e)
            }
        }
        if (self.state === 'pending') {
            // 回调函数还在执行过程中，状态没有改变。
            // 确实是想不出来 怎么执行。
            // 
            if (func_reject !== undefined) {
                self.resolveFuncList.push(function () {
                    try {
                        let newProVal = func_reject(self.asyncdata)
                        res(newProVal)
                    } catch (e) {
                        rej(e)
                    }
                    // 但是这样的话, 如果then里面注册的是异步函数的话，就会没有办法执行。
                })
                self.rejectFuncList.push(function () {
                    try {
                        let newProVal = func_reject(self.asyncdata)
                        // 如果 then 里面传递的是异步函数,返回值也会传递, 因为这部分是包围在一个 function 里面 
                        // 而且 这个这个 function 是直接传递给 promise 的
                        res(newProVal)
                    } catch (e) {
                        rej(e)
                    }
                })
            } else {
                if (func_resolve === undefined) {
                    throw new Error('func_resolve 未定义')
                } else {
                    self.resolveFuncList.push(function () {
                        try {
                            let newProVal = func_reject(self.asyncdata)
                            res(newProVal)
                        } catch (e) {
                            rej(e)
                        }
                    })

                }
            }
        }
    })

    return newP


}