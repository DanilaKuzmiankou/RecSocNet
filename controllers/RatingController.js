const {Rating, User, Review} = require('../models/Models')
const Sequelize = require("sequelize");
const ApiError = require("../error/ApiError");
const op = Sequelize.Op;

class RatingController {


    /*   where: {authId},
       include: {
           model: Rating,
           where: {
               userId: {[op.col]: 'user.id'},
               id: reviewId
           }
       }
   }*/

    async changeReviewLikeState(req, res, next) {
        const {authId, reviewId} = req.body
        let likedStatus
        try {
            const user = await User.findOne({where: {authId}})
            const review = await Review.findOne({where: {id:reviewId}})
            const ratings = await user.getRatings({where: {reviewId}})
            let likes =  user.likes
            let usersReviewScore = review.usersReviewScore
            if (ratings.length > 0) {
                likedStatus = false
                ratings[0].destroy()
                likes--
                usersReviewScore--
            } else {
                likedStatus = true
                const rating = await Rating.create({reviewScore: true})
                rating.setUser(user)
                rating.setReview(review)
                likes++
                usersReviewScore++
            }
            await user.update({likes})
            await review.update({usersReviewScore})
            return res.status(200).json({liked: likedStatus, usersReviewScore, likes})
        } catch (e) {
            console.log('error: ', e)
            return next(ApiError.badRequest('An unhandled exception occurred: ', e))
        }
    }

    async changeReviewUsersContentScore(req, res, next) {
        const {authId, reviewId, contentScore} = req.body
        try {
            const user = await User.findOne({where: {authId}})
            const review = await Review.findOne({where: {id:reviewId}})
            const ratings = await user.getRatings({where: {reviewId}})
            let usersContentScore = review.usersContentScore
            if (ratings.length > 0) {
                await ratings[0].update( {contentScore})
            } else {
                const rating = await Rating.create({contentScore})
                rating.setUser(user)
                rating.setReview(review)
            }

            return res.status(200).json({liked: likedStatus, usersReviewScore, likes})
        } catch (e) {
            console.log('error: ', e)
            return next(ApiError.badRequest('An unhandled exception occurred: ', e))
        }
    }

}

module.exports = new RatingController()