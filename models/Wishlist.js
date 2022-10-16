const mongoose = require("mongoose");

const WishlistSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: "products",
    },
  ],
});

module.exports = mongoose.model("wishlists", WishlistSchema);
