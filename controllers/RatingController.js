const { Rating, User, Review } = require("../models/Models");
const ApiError = require("../error/ApiError");

let ratingController;

class RatingController {
  constructor() {
    ratingController = this;
  }

  async changeReviewLikeState(req, res, next) {
    const { authId, reviewId } = req.body;
    let likedStatus;
    try {
      const user = await User.findOne({ where: { authId } });
      const review = await Review.findOne({ where: { id: reviewId } });
      const ratings = await user.getRatings({ where: { reviewId } });
      const reviewUser = await review.getUser();
      let likes = reviewUser.likes;
      let usersReviewScore = review.usersReviewScore;
      if (ratings[0]) {
        likedStatus = !ratings[0].reviewScore;
        ratings[0].update({ reviewScore: likedStatus });
        if (likedStatus) {
          likes++;
          usersReviewScore++;
        } else {
          likes--;
          usersReviewScore--;
        }
      } else {
        likedStatus = true;
        const rating = await Rating.create({ reviewScore: true });
        rating.setUser(user);
        rating.setReview(review);
        likes++;
        usersReviewScore++;
      }
      await reviewUser.update({ likes });
      await review.update({ usersReviewScore });
      return res
        .status(200)
        .json({ liked: likedStatus, usersReviewScore, likes });
    } catch (e) {
      console.log("error: ", e);
      return next(ApiError.badRequest("An unhandled exception occurred: ", e));
    }
  }

  async changeReviewUsersContentScore(req, res, next) {
    let { authId, reviewId, contentScore } = req.body;
    try {
      const user = await User.findOne({ where: { authId } });
      const review = await Review.findOne({ where: { id: reviewId } });
      const ratings = await user.getRatings({ where: { reviewId } });
      const usersContentScore = review.usersContentScore;
      const usersContentScoreCount = review.usersContentScoreCount;
      let newUsersContentScore;
      let newUsersContentScoreCount;
      let resStatus = 200;
      if (ratings.length > 0) {
        const prevContentScore = ratings[0].contentScore;
        if (prevContentScore === null || prevContentScore === 0) {
          newUsersContentScore =
            ratingController.calculateNewAverageWithAddition(
              usersContentScore,
              usersContentScoreCount,
              contentScore
            );
          newUsersContentScoreCount = usersContentScoreCount + 1;
        } else if (prevContentScore === contentScore) {
          newUsersContentScore = ratingController.getAverageBeforeAddition(
            usersContentScore,
            usersContentScoreCount,
            contentScore,
            prevContentScore
          );
          newUsersContentScoreCount = usersContentScoreCount - 1;
          contentScore = null;
          resStatus = 202;
        } else {
          newUsersContentScore =
            ratingController.calculateNewAverageWithSubtraction(
              usersContentScore,
              usersContentScoreCount,
              contentScore,
              prevContentScore
            );
          newUsersContentScoreCount = usersContentScoreCount;
        }
        await ratings[0].update({ contentScore });
      } else {
        const rating = await Rating.create({ contentScore });
        newUsersContentScore = ratingController.calculateNewAverageWithAddition(
          usersContentScore,
          usersContentScoreCount,
          contentScore
        );
        newUsersContentScoreCount = usersContentScoreCount + 1;
        rating.setUser(user);
        rating.setReview(review);
      }
      await review.update({
        usersContentScore: newUsersContentScore,
        usersContentScoreCount: newUsersContentScoreCount,
      });
      return res
        .status(resStatus)
        .json({ usersContentScore: newUsersContentScore });
    } catch (e) {
      console.log("error: ", e);
      return next(ApiError.badRequest("An unhandled exception occurred: ", e));
    }
  }

  calculateNewAverageWithAddition(prevAverage, numbersCount, newNumber) {
    let averageWithAddition =
      (prevAverage * numbersCount + newNumber) / (numbersCount + 1);
    averageWithAddition = +averageWithAddition.toFixed(4);
    return averageWithAddition;
  }

  calculateNewAverageWithSubtraction(
    prevAverage,
    numbersCount,
    newNumber,
    prevNumber
  ) {
    const averageBeforeAddition = ratingController.getAverageBeforeAddition(
      prevAverage,
      numbersCount,
      newNumber,
      prevNumber
    );
    return ratingController.calculateNewAverageWithAddition(
      averageBeforeAddition,
      numbersCount - 1,
      newNumber
    );
  }

  getAverageBeforeAddition(prevAverage, numbersCount, newNumber, prevNumber) {
    let averageBeforeAddition =
      (prevAverage * numbersCount - prevNumber) / (numbersCount - 1);
    averageBeforeAddition = averageBeforeAddition || 0; // if averageBeforeAddition===NaN(or other false value) it will be converted to 0
    return averageBeforeAddition;
  }
}

module.exports = new RatingController();
