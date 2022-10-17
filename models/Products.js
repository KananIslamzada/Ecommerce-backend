const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isSale: {
    type: Boolean,
    required: true,
    default: false,
  },
  salePrice: {
    type: String,
    required: false,
    default: "",
  },
  price: {
    type: String,
    required: true,
  },
  coverPhoto: {
    type: String,
    required: true,
  },
  stockCount: {
    type: Number,
    required: true,
  },
  store: {
    type: mongoose.Types.ObjectId,
  },
  category: {
    type: mongoose.Types.ObjectId,
  },
  reviews: [
    {
      type: mongoose.Types.ObjectId,
      ref: "reviews",
    },
  ],
  photos: [photoSchema],
});

module.exports = mongoose.model("products", productSchema);
