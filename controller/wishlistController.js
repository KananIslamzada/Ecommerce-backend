const {
  validateAsync,
  Str,
  wishlistSchema,
  sendWishSchema,
  deleteWishlistSchema,
} = require("../constants/Validations");
const User = require("../models/User");
const Products = require("../models/Products");
const Wishlist = require("../models/Wishlist");

const getWishes = async (req, res) => {
  const { id } = req.params;
  try {
    await validateAsync(Str.required(), id);
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(400).json({ message: "User not found!" });
    const wishes = await Wishlist.findOne({ userId: id }).populate({
      path: "products",
      select: { __v: 0, description: 0, stockCount: 0, store: 0, photos: 0 },
    });
    const count = wishes.products.length;
    res.status(200).json({ data: wishes, count });
  } catch (error) {
    res.status(400).json(error);
  }
};

const createWish = async (req, res) => {
  const { productId, userId } = req.body;
  try {
    await validateAsync(wishlistSchema, { product: productId, userId });
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).json({ message: "User not found!" });
    const product = await Products.findOne({ _id: productId });
    if (!product)
      return res.status(400).json({ message: "Product not found!" });

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      const newWish = new Wishlist({
        userId,
        products: [product._id],
      });
      await newWish.save();
      return res.status(200).json({ message: "Added to wishlist" });
    }
    if (wishlist.products.includes(productId))
      return res
        .status(400)
        .json({ message: "Product is already in your wishlist!" });

    await Wishlist.updateOne(
      { userId },
      {
        $push: {
          products: product._id,
        },
      }
    );

    res.status(200).json({ message: "Added to wishlist" });
  } catch (error) {
    if (error.name === "CastError")
      return res.status(400).json({ message: "Id is incorrect!" });
    res.status(400).json(error);
  }
};

const sendWishes = async (req, res) => {
  const { wishlist, userId } = req.body;
  try {
    await validateAsync(sendWishSchema, { wishlist, userId });

    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).json({ message: "User not found!" });
    const userWishlist = await Wishlist.findOne({ userId });
    if (!userWishlist) {
      const newWish = new Wishlist({
        userId,
        products: wishlist,
      });
      await newWish.save();
      return res.status(200).json({ message: "OK" });
    }

    if (wishlist?.length) {
      const ids = userWishlist.products.map((item) => item.toString());
      const clearDuplicate = new Set(wishlist?.concat(ids));
      const newWishList = [...clearDuplicate];

      await Wishlist.updateOne(
        { userId },
        {
          $set: {
            products: newWishList,
          },
        }
      );
    }

    res.status(200).json({ message: "OK" });
  } catch (error) {
    if (error.name === "CastError")
      return res.status(400).json({ message: "Id is incorrect!" });
    res.status(400).json(error);
  }
};

const deleteWish = async (req, res) => {
  const { productId, userId } = req.body;
  try {
    await validateAsync(deleteWishlistSchema, { userId, productId });
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).json({ message: "User not found!" });
    const product = await Products.findOne({ _id: productId });
    if (!product)
      return res.status(400).json({ message: "Product not found!" });
    const wishlist = await Wishlist.findOne({ userId });
    const strIds = wishlist.products.map((item) => item.toString());
    if (!strIds.includes(productId))
      return res.status(400).json({ message: "Product is not in wishlist" });

    const filteredIds = strIds.filter((id) => id !== productId);
    await Wishlist.updateOne(
      { id: userId },
      {
        $set: {
          products: filteredIds,
        },
      }
    );

    return res.status(200).json({ wishlist: filteredIds });
  } catch (error) {
    if (error.name === "CastError")
      return res.status(400).json({ message: "Id is incorrect!" });
    res.status(400).json(error);
  }
};

module.exports = {
  getWishes,
  createWish,
  sendWishes,
  deleteWish,
};
