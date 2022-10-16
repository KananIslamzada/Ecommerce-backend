const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
  review: {
    type: String,
    required: true,
  },
  starCount: {
    type: Number,
    required: true,
  },
  profileImage: {
    type: String,
    required: false,
  },
  productId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("reviews", ReviewSchema);
