const Router = require('express')
const router = new Router()
const ratingController = require('../controllers/RatingController')

router.post('/changeReviewLikeState', ratingController.changeReviewLikeState)

module.exports = router