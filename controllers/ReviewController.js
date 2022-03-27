const ApiError = require("../error/ApiError");
const { Review, User, ReviewImage, Rating, Tags } = require("../models/Models");
const Sequelize = require("sequelize");
const sequelize = require("sequelize");
const op = Sequelize.Op;

let reviewController = this;

class ReviewController {
  constructor() {
    reviewController = this;
  }

  async addNewReview(req, res, next) {
    const { authId, review } = req.body;
    if (!authId || !review.authorScore || !review.category || !review.title) {
      return next(ApiError.badRequest("Enter all required fields"));
    }
    const user = await User.findOne({ where: { authId } });
    let createdReview = await Review.create({
      category: review.category,
      tags: review.tags,
      authorScore: review.authorScore,
      title: review.title,
      text: review.text,
      userId: user.id,
    });
    if (review.images && review.images.length > 0) {
      createdReview = await reviewController.addReviewImages(
        createdReview,
        review.images
      );
    }
    await reviewController.addNewTags(review.tags);
    return res.json([createdReview]);
  }

  async addReviewImages(createdReview, images) {
    const imagesDB = [];
    let image;
    for (const link of images) {
      if (link) {
        image = await ReviewImage.create({ imageLink: link });
        imagesDB.push(image);
      }
    }
    await createdReview.setImages(imagesDB);
    createdReview = await Review.findOne({
      where: { id: createdReview.id },
      include: [
        {
          model: ReviewImage,
          as: "images",
          attributes: ["imageLink"],
        },
      ],
    });
    return createdReview;
  }

  async getAllAuthorReviews(req, res, next) {
    const { authId, userId } = req.body;
    if (!authId) {
      return next(ApiError.badRequest("There is no authId!"));
    }
    const reviews = await Review.findAll({
      where: { userId },
      include: [
        {
          model: ReviewImage,
          as: "images",
          attributes: ["imageLink"],
        },
      ],
    });
    return res.json(reviews);
  }

  async getReviews(limit, offset, userId, whereParams, orderParams) {
    return await Review.findAll({
      subQuery: false,
      order: orderParams,
      where: whereParams,
      include: [
        {
          model: ReviewImage,
          as: "images",
          attributes: ["imageLink"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name"],
        },
        {
          model: Rating,
          as: "ratings",
          attributes: ["reviewScore", "contentScore"],
          where: {
            userId: {
              [op.ne]: null,
              [op.eq]: userId,
            },
          },
          required: false,
        },
      ],
      limit: limit,
      offset: offset,
    });
  }

  async getNewestReviews(req, res, next) {
    const { limit, offset, userId } = req.body;
    return res.json(
      await reviewController.getReviews(limit, offset, userId, {}, [
        ["createdAt", "DESC"],
      ])
    );
  }

  async getMostLikedReviews(req, res, next) {
    const { limit, offset, userId } = req.body;
    const reviews = await reviewController.getReviews(
      limit,
      offset,
      userId,
      {},
      [
        ["usersReviewScore", "DESC"],
        ["createdAt", "DESC"],
      ]
    );
    return res.json(reviews);
  }

  async getTagReviews(req, res, next) {
    const { tag, limit, offset, userId } = req.body;
    const reviews = await reviewController.getReviews(
      limit,
      offset,
      userId,
      {
        tags: {
          [op.substring]: tag,
        },
      },
      [["createdAt", "DESC"]]
    );
    res.json(reviews);
  }

  async findReviews(req, res, next) {
    let { limit, offset, searchedString, userId } = req.body;
    searchedString = "'" + searchedString + "'";
    const updateIndexes = `CREATE INDEX IF NOT EXISTS idx_fts_articles ON reviews
             USING gin(make_tsvector(title, text, tags));
            
            CREATE INDEX IF NOT EXISTS idx_fts_users ON users
            USING gin(make_tsvector(name));`;
    await Review.sequelize.query(updateIndexes);
    const whereQueryString = {
      [op.and]: [
        sequelize.literal(
          `make_tsvector(title, text, tags, "user".name) @@ plainto_tsquery(${searchedString})`
        ),
      ],
    };
    const reviews = await reviewController.getReviews(
      limit,
      offset,
      userId,
      whereQueryString,
      [["createdAt", "DESC"]]
    );
    return res.json(reviews);
  }

  async saveReview(req, res, next) {
    const { review } = req.body;
    const oldReview = await Review.findOne({ where: { id: review.id } });
    await oldReview.update({
      title: review.title,
      text: review.text,
      tags: review.tags,
      category: review.category,
      authorScore: review.authorScore,
    });
    await reviewController.addNewTags(review.tags);
    const newReview = await Review.findOne({
      where: { id: review.id },
      include: [
        {
          model: ReviewImage,
          as: "images",
          attributes: ["imageLink"],
        },
      ],
    });
    return res.json(newReview);
  }

  async getTags(req, res, next) {
    let tagsFromDB = await Tags.findAll({
      attributes: ["tag"],
    });
    tagsFromDB = tagsFromDB.map((item) => (item = item.tag));
    return res.json(tagsFromDB);
  }

  async addNewTags(rawTags) {
    const tags = rawTags.split(",");
    let tagsFromDB = await Tags.findAll({
      attributes: ["tag"],
      where: {
        tag: {
          [op.in]: tags,
        },
      },
    });
    let newTags = tags;
    if (tagsFromDB.length > 0) {
      tagsFromDB = tagsFromDB.map((item) => (item = item.tag));
      newTags = tags.filter((tag) => !tagsFromDB.includes(tag));
    }
    for (const tag of newTags) {
      await Tags.create({
        tag,
      });
    }
  }

  async deleteReview(req, res, next) {
    const { authId, id } = req.body;
    if (!authId) {
      return next(ApiError.badRequest("There is no authId!"));
    }
    const user = await User.findOne({ where: { authId } });
    try {
      ReviewImage.destroy({
        where: { reviewId: id },
      }).then(
        Review.destroy({
          where: { id },
        })
      );
      return res
        .status(200)
        .json({ message: "Review was successfully deleted!" });
    } catch (e) {
      return res
        .status(500)
        .json({ message: "An error occurred while review deleting: ", e });
    }
  }

  async deleteImage(req, res, next) {
    const { url } = req.body;
    try {
      await ReviewImage.destroy({
        where: { imageLink: url },
      });
      return res
        .status(200)
        .json({ message: "Image was successfully deleted!" });
    } catch (e) {
      return res
        .status(500)
        .json({ message: "An error occurred while image deleting: ", e });
    }
  }

  async addImage(req, res, next) {
    const { url, reviewId } = req.body;
    await ReviewImage.create({
      imageLink: url,
      reviewId: reviewId,
    });
    return res.status(200).json({ message: "Image was successfully added!" });
  }
}

module.exports = new ReviewController();
