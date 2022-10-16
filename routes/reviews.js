const express = require("express");
const {
  createReview,
  deleteReview,
  getReview,
  getReviews,
} = require("../controller/reviewController");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", getReviews);

router.get("/review/:id?", getReview);

router.post("/create", auth, createReview);

router.delete("/delete/:id?", auth, deleteReview);

module.exports = router;
