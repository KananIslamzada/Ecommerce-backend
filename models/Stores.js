const mongoose = require("mongoose");

const StoreSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  followers: {
    type: Number,
    default: 0,
  },
  isOfficial: {
    type: Boolean,
    default: false,
  },
  joined: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: mongoose.Types.ObjectId,
      ref: "reviews",
    },
  ],
  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: "products",
    },
  ],
});

module.exports = mongoose.model("stores", StoreSchema);
