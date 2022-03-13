const Router = require('express')
const router = new Router()
const userRouter = require('./UserRouter')
const reviewRouter = require('./ReviewRouter')
const ratingRouter = require('./RatingRouter')

router.use('/user', userRouter)
router.use('/review', reviewRouter)
router.use('/rating', ratingRouter)

module.exports = router