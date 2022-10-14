const {
  Str,
  validateAsync,
  productSchema,
  validate,
} = require("../constants/Validations");
const Products = require("../models/Products");
const Reviews = require("../models/Reviews");
const Stores = require("../models/Stores");

const getProducts = async (req, res) => {
  const { page } = req.params || 0;
  const limit = 10;
  const skip = parseInt(page) * limit || 0;
  try {
    const products = await Products.find()
      .skip(skip)
      .limit(limit)
      .select("_id , name , coverPhoto , isSale , salePrice , price , reviews")
      .populate("reviews", "starCount");
    const count = await Products.count();
    const next =
      count % (skip + limit) === count || (count === 0 && skip === 0)
        ? false
        : true;
    res.status(200).json({
      data: products,
      count,
      next,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const getProduct = async (req, res) => {
  const { id } = req.params;
  const { error } = validate(Str.required(), id);
  if (error) return res.status(400).json(error);
  try {
    const product = await Products.findOne({ _id: id }).populate(
      "reviews",
      "-productId"
    );
    if (!product)
      return res.status(400).json({ message: "Product not found!" });
    const store = await Stores.findOne({ id }).select(
      "name , photo , _id , isOfficial"
    );

    const productObj = product.toObject();
    const reviewLength = productObj.reviews.length;
    const hasReview = !!reviewLength;
    const averageStarCount = hasReview
      ? productObj.reviews.reduce((acc, val) => acc + val.starCount, 0) /
        productObj.reviews.length
      : null;

    productObj.averageStarCount = averageStarCount?.toFixed(1);
    productObj.store = store;
    productObj.reviewsCount = reviewLength;
    res.status(200).json(productObj);
  } catch (error) {
    res.status(400).json(error);
  }
};

const createProduct = async (req, res) => {
  const product = req.body;
  try {
    await validateAsync(productSchema, product);
    const store = await Stores.findOne({ _id: product.store });
    if (!store) return res.status(400).json({ message: "Store not found!" });
    const newProduct = new Products(product);
    await newProduct.save();
    await Stores.updateOne(
      {
        _id: newProduct.store,
      },
      {
        $push: {
          products: newProduct.id,
        },
      }
    );

    res.status(200).json(newProduct);
  } catch (error) {
    if (error.code === 11000)
      return res
        .status(400)
        .json({ message: `${error.keyValue.name} is already exists!` });
    res.status(400).json(error);
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { error } = validate(Str.required(), id);
  if (error) return res.status(400).json(error);
  try {
    const deletedProduct = await Products.findOneAndDelete({ _id: id });
    if (!deletedProduct)
      return res.status(400).json({ message: "Product not found!" });

    const store = await Stores.findOne({ _id: deletedProduct.store });
    if (!store) return res.status(400).json({ message: "Store not found!" });
    const reviews = deletedProduct.reviews.map((item) => item._id.toString());

    await Stores.updateOne(
      { _id: deletedProduct.store },
      {
        $set: {
          reviews: store.reviews.filter(
            (item) => !reviews.includes(item.toString())
          ),
          products: store.products.filter(
            (item) => item._id != deletedProduct.id
          ),
        },
      }
    );

    await Reviews.deleteMany({ _id: { $in: reviews } });

    res.status(200).json({ message: "Product was deleted!" });
  } catch (error) {
    if (error.name === "CastError")
      return res.status(400).json({ message: "Product not found!" });
    res.status(400).json(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
};
