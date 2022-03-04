const Router = require('express')
const router = new Router()
const JWTCheck = require("../utils/JWTCheck");
const reviewController = require('../controllers/ReviewController')


router.post('/getAuthorReviews', reviewController.getAllAuthorReviews)
//router.get('/userReview', userController.getUsers)
router.post('/edit', reviewController.saveReview)
router.post('/create', reviewController.addNewReview)
router.post('/delete', reviewController.deleteReview)
router.post('/deleteImage', reviewController.deleteImage)
router.post('/addImage', reviewController.addImage)


module.exports = router