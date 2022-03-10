const ApiError = require("../error/ApiError");
const {Review, User, ReviewImage} = require("../models/Models");

var reviewController = this;

class ReviewController {
    constructor() {
        reviewController = this
    }

    async addNewReview(req, res, next) {
        const {authId, review} = req.body
        console.log('review: ', req.body)
        if (!authId || !review.authorScore || !review.tags || !review.category || !review.title || !review.text) {
            return next(ApiError.badRequest('Enter all required fields'))
        }
        let user = await User.findOne({where: {authId}})
        let createdReview = await Review.create({
            category: review.category,
            tags: review.tags,
            authorScore: review.authorScore,
            title: review.title,
            text: review.text,
            userId: user.id
        })
        if (review.images && review.images.length > 0) {
            createdReview = await reviewController.addReviewImages(createdReview, review.images)
        }
        return res.json([createdReview])
    }

     async addReviewImages (createdReview, images){
        let imagesDB = []
        let image
        for (const link of images) {
            let image = await ReviewImage.create({imageLink: link})
            imagesDB.push(image)
        }
        await createdReview.setImages(imagesDB)
        createdReview = await Review.findOne({
            where: {id:createdReview.id},
            include: [{
                model: ReviewImage,
                as: 'images',
                attributes: ['imageLink']
            }]
        });
        return createdReview
    }

    async getAllAuthorReviews(req, res, next) {
        const {authId, userId} = req.body
        if (!authId) {
            return next(ApiError.badRequest('There is no authId!'))
        }
        let reviews = await Review.findAll({
            where: {userId},
            include: [{
                model: ReviewImage,
                as: 'images',
                    attributes: ['imageLink']
            }]
        });
        return res.json(reviews)
    }

    async getNewestReviews(req, res, next) {
        let reviews = await Review.findAll({
            order: [ [ 'createdAt', 'DESC' ]],
            include: [{
                model: ReviewImage,
                as: 'images',
                attributes: ['imageLink']
            },
                {
                    model: User,
                    attributes: ['id', 'name']
                }
            ],
            limit: 10
        });
        return res.json(reviews)
    }



    async saveReview(req, res, next) {
        const {review} = req.body
        const oldReview = await Review.findOne({where: {id: review.id}})
        await oldReview.update({ title:review.title, text:review.text, tags:review.tags, category:review.category, authorScore:review.authorScore })
        let newReview = await Review.findOne({
            where: {id: review.id},
            include: [{
                model: ReviewImage,
                as: 'images',
                attributes: ['imageLink']
            }]
        })
        return res.json(newReview)
    }

    async deleteReview(req, res, next) {
        const {authId, id} = req.body
        if (!authId) {
            return next(ApiError.badRequest('There is no authId!'))
        }
        const user = await User.findOne({where: {authId}})
        try {
            ReviewImage.destroy({
                where: {reviewId: id}
            }).then(Review.destroy({
                where: {id}
            }))
            return res.status(200).json({message: 'Review was successfully deleted!'})
        }
        catch (e) {
            return res.status(500).json({message: 'An error occurred while review deleting: ', e})
        }
    }

    async deleteImage(req, res, next) {
        const {url} = req.body
        try {
            await ReviewImage.destroy({
                where: {imageLink: url}
            });
            return res.status(200).json({message: 'Image was successfully deleted!'})
        }
        catch (e) {
            return res.status(500).json({message: 'An error occurred while image deleting: ', e})
        }
    }

    async addImage(req, res, next) {
        const {url, reviewId} = req.body
        await ReviewImage.create({
            imageLink:url,
            reviewId:reviewId
        })
        return res.status(200).json({message: 'Image was successfully added!'})
    }

}


module.exports = new ReviewController()
