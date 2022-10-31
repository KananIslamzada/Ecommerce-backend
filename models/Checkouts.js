const mongoose = require("mongoose");

const CheckoutSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "users",
  },
  products: [
    {
      productId: {
        type: mongoose.Types.ObjectId,
        ref: "products",
      },
      count: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("checkouts", CheckoutSchema);
