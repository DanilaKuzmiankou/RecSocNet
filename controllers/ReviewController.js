const ApiError = require("../error/ApiError");
const {Review, User, ReviewImage} = require("../models/Models");

class ReviewController {

    async addNewReview(req, res, next) {
        const {authId, category, tags, authorScore, title, text, imageLink} = req.body
        if (!authId || !authorScore || !tags || !category || !title || !text) {
            return next(ApiError.badRequest('Enter all required fields'))
        }
        let user = await User.findOne({where: {authId}})
        const review = await Review.create({category, tags, authorScore, title, text, userId: user.id})
        let reviewId = review.id
        if (imageLink && imageLink.length > 0) {
            for (const link of imageLink) {
                await ReviewImage.create({imageLink: link, reviewId})
            }
        }
        return res.status(200).json({message: 'Review were successfully created!'})
    }

    async getAllAuthorReviews(req, res, next) {
        const {authId} = req.body
        if (!authId) {
            return next(ApiError.badRequest('There is no authId!'))
        }
        const user = await User.findOne({where: {authId}})
        const reviews = await user.getReviews()
        // let images
        // reviews.map(async function (review) {
        //
        //     images = await ReviewImage.findAll({where: {reviewId: review.id}})
        //     console.log("iamges 1")
        //     console.log(images)
        // })
        // console.log("images 2:")
        // console.log(images)
        return res.json(reviews)
    }


    async saveReview(req, res, next) {
        const {authId, review} = req.body
        if (!authId) {
            return next(ApiError.badRequest('There is no authId!'))
        }
        const user = await User.findOne({where: {authId}})
        const oldReview = await Review.findOne({where: {id: review.id}})
        await oldReview.update({ title:review.title, text:review.text, tags:review.tags, category:review.category, authorScore:review.authorScore })
    }

}

module.exports = new ReviewController()
