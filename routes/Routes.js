const Router = require('express')
const router = new Router()
const userRouter = require('./UserRouter')
const reviewRouter = require('./ReviewRouter')

router.use('/user', userRouter)
router.use('/review', reviewRouter)

module.exports = router