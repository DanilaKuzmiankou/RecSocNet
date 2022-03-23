const Router = require("express");
const router = new Router();
const reviewController = require("../controllers/ReviewController");

router.post("/getAuthorReviews", reviewController.getAllAuthorReviews);
router.post("/newestReviews", reviewController.getNewestReviews);
router.post("/mostLikedReviews", reviewController.getMostLikedReviews);
router.post("/findReviews", reviewController.findReviews);
router.post("/edit", reviewController.saveReview);
router.post("/create", reviewController.addNewReview);
router.post("/delete", reviewController.deleteReview);
router.post("/deleteImage", reviewController.deleteImage);
router.post("/addImage", reviewController.addImage);
router.post("/tags", reviewController.getTags);

module.exports = router;
