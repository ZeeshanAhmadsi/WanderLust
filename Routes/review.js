const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const {validatereview,isLoggedIn,isAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//Reviews
// Post : create review Route
router.post("/",isLoggedIn,validatereview,wrapAsync(reviewController.createReview));


//Delete review Route
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;