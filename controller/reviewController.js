const {
  validateAsync,
  reviewSchema,
  Str,
} = require("../constants/Validations");
const Products = require("../models/Products");
const Reviews = require("../models/Reviews");
const Stores = require("../models/Stores");

const createReview = async (req, res) => {
  const review = req.body;
  try {
    await validateAsync(reviewSchema, review);
    const product = await Products.findOne({ _id: review.productId });
    if (!product)
      return res.status(400).json({ message: "Product not found!" });
    const store = await Stores.findOne({ _id: product.store });
    if (!store) return res.status(400).json({ message: "Store not found!" });
    const newReview = new Reviews(review);
    await newReview.save();
    await Products.updateOne(
      {
        _id: product._id,
      },
      {
        $push: {
          reviews: newReview._id,
        },
      }
    );

    await Stores.updateOne(
      {
        _id: product.store,
      },
      {
        $push: {
          reviews: newReview._id,
        },
      }
    );

    res.status(200).json(newReview);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    await validateAsync(Str.required(), id);
    const deletedReview = await Reviews.findOneAndDelete({ _id: id });
    if (!deletedReview)
      return res.status(400).json({ message: "Review not found!" });

    const product = await Products.findOne({ _id: deletedReview.productId });
    const store = await Stores.findOne({ _id: product.store });

    await Products.updateOne(
      {
        _id: deletedReview.productId,
      },
      {
        $set: {
          reviews: product.reviews.filter((e) => e._id != deletedReview.id),
        },
      }
    );

    await Stores.updateOne(
      {
        _id: product.store,
      },
      {
        $set: {
          reviews: store.reviews.filter((e) => e._id != deletedReview.id),
        },
      }
    );

    res.status(200).json({ message: "Review was deleted!" });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

module.exports = {
  createReview,
  deleteReview,
};
