const express = require("express");
const {
  createReview,
  deleteReview,
} = require("../controller/reviewController");
const router = express.Router();

router.post("/create", createReview);
router.delete("/delete/:id?", deleteReview);

module.exports = router;
