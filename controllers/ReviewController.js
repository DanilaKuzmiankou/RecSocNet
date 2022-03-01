const ApiError = require("../error/ApiError");
const {Review, User, ReviewImage} = require("../models/Models");

class ReviewController {

    async addNewReview(req, res, next) {
        const {authId, review} = req.body
        console.log('review: ', req.body)
        if (!authId || !review.authorScore || !review.tags || !review.category || !review.title || !review.text) {
            return next(ApiError.badRequest('Enter all required fields'))
        }
        let user = await User.findOne({where: {authId}})
        const createdReview = await Review.create({
            category: review.category,
            tags: review.tags,
            authorScore: review.authorScore,
            title: review.title,
            text: review.text,
            userId: user.id
        })
        let reviewId = createdReview.id
        if (review.images && review.images.length > 0) {
            for (const link of review.images) {
                await ReviewImage.create({imageLink: link, reviewId})
            }
        }
        return res.json([createdReview])
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

    async deleteReview(req, res, next) {
        const {authId, id} = req.body
        if (!authId) {
            return next(ApiError.badRequest('There is no authId!'))
        }
        const user = await User.findOne({where: {authId}})
        await Review.destroy({
            where: {id}
        });
    }



}

module.exports = new ReviewController()
