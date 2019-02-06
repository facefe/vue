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
            asyncFunc(data)

        })
    }

    function reject(data) {
        self.state = 'reject'
        self.asyncdata = data
        self.rejectFuncList.forEach(function (asyncFunc) {
            asyncFunc(data)

        })
    }
    try {
        func(resolve, reject)
    } catch (e) {
        reject(e)
    }
}

Promise_mine.prototype.then = function (func_resolve, func_reject) {
    let self = this

    // 还有链式执行。
    let newPro = new Promise_mine(function (res, rej) {
        if (self.state === 'fulfilled') {
            try {
                let newRes = func_resolve(self.asyncdata)
                res(newRes)
            } catch (e) {
                rej(e)
            }
        }
        if (self.state === 'reject') {
            try {
                let newRes = func_reject(self.asyncdata)
                res(newRes)
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
                        let newRes = func_resolve(self.asyncdata)
                        res(newRes)
                    } catch (e) {
                        rej(e)
                    }
                })
                self.rejectFuncList.push(function () {
                    try {
                        let newRes = func_reject(self.asyncdata)
                        res(newRes)
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
                            let newRes = func_resolve(self.asyncdata)
                            res(newRes)
                        } catch (e) {
                            rej(e)
                        }
                    })

                }
            }
        }
    })

    return newPro

    // 有点复杂...

}