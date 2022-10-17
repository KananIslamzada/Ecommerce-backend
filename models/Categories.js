const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  bgColor: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  products:[
    {
      type:mongoose.Types.ObjectId,
      ref:"products"
    }
  ]
});

module.exports = mongoose.model("categories", CategorySchema);
