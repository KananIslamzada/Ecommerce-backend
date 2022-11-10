const mongoose = require("mongoose");

const CardSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "users",
  },
  products: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: "products",
      },
      count: {
        type: Number,
        default: 1,
      },
    },
  ],
});

module.exports = mongoose.model("cards", CardSchema);
