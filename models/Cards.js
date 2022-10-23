const mongoose = require("mongoose");

const CardSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "users",
  },
  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: "products",
    },
  ],
});

module.exports = mongoose.model("cards", CardSchema);
