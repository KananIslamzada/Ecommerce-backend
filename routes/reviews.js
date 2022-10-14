const express = require("express");
const {
  createReview,
  deleteReview,
  getReview,
  getReviews,
} = require("../controller/reviewController");
const router = express.Router();

router.get("/", getReviews);

router.get("/review/:id?", getReview);

router.post("/create", createReview);

router.delete("/delete/:id?", deleteReview);

module.exports = router;
