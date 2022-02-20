const Router = require('express')
const router = new Router()
const JWTCheck = require("../utils/JWTCheck");
const reviewController = require('../controllers/ReviewController')

router.post('/addNewReview', reviewController.addNewReview)
router.post('/getAuthorReviews', reviewController.getAllAuthorReviews)
//router.get('/userReview', userController.getUsers)


module.exports = router