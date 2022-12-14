const {
  Str,
  validateAsync,
  productSchema,
  validate,
} = require("../constants/Validations");
const Products = require("../models/Products");
const Reviews = require("../models/Reviews");
const Stores = require("../models/Stores");
const jwt = require("jsonwebtoken");
const Wishlist = require("../models/Wishlist");
const Categories = require("../models/Categories");
require("dotenv/config");

const getProducts = async (req, res) => {
  let isLogged = false;
  let userId = null;
  const token = req.headers.authorization;
  if (token) {
    const jwtResponse = jwt.verify(token, process.env.TOKEN_KEY, (err) => {
      if (err) return { message: "Invalid token!", code: "auth" };
      const { userId: id } = req.body;
      const { error } = validate(Str.required(), id);
      if (error) return { message: "Invalid token!", code: "valid", error };
      userId = id;
      isLogged = true;
    });
    if (jwtResponse?.code === "auth") return res.status(400).json(jwtResponse);
    if (jwtResponse?.code === "valid")
      return res.status(400).json(jwtResponse.error);
  }
  try {
    const products = await Products.find()
      .select(
        "_id , name , coverPhoto , isSale , salePrice , price , reviews , category"
      )
      .populate("reviews", "starCount");
    const count = products.length;
    const responseData = {
      data: products,
      count,
    };

    if (isLogged) {
      const wishlist = await Wishlist.findOne({ id: userId });
      responseData["wishlist"] = wishlist?.products || [];
    }

    res.status(200).json(responseData);
  } catch (error) {
    if (error.name === "CastError")
      return res.status(400).json({ message: "Id is incorrect!" });
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
    const store = await Stores.findOne({ _id: product.store }).select(
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
    productObj.reviewsCount = reviewLength;
    productObj.store = store;
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
    const category = await Categories.findOne({ _id: product.category });
    if (!category)
      return res.status(400).json({ message: "Category not found!" });
    const newProduct = new Products(product);
    await newProduct.save();

    await Categories.updateOne(
      {
        id: newProduct.categoryId,
      },
      {
        $push: {
          products: newProduct._id,
        },
      }
    );

    await Stores.updateOne(
      {
        _id: newProduct.store,
      },
      {
        $push: {
          products: newProduct._id,
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
