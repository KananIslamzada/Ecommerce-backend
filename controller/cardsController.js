const {
  validateAsync,
  Str,
  addToCardSchema,
  deleteProductFromCardSchema,
} = require("../constants/Validations");
const Cards = require("../models/Cards");
const User = require("../models/User");
const Products = require("../models/Products");

const getCard = async (req, res) => {
  const { id } = req.params;
  try {
    await validateAsync(Str.required(), id);
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(400).json({ message: "User not found!" });
    const card = await Cards.findOne({ userId: id }).populate("products");
    if (!card) return res.status(200).json({ data: [] });
    res.status(200).json(card);
  } catch (error) {
    if (error.name === "CastError")
      return res.status(400).json({ message: "Id is incorrect!" });
    res.status(400).json(error);
  }
};

const addToCard = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    await validateAsync(addToCardSchema, { userId, productId });
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).json({ message: "User not found!" });
    const product = await Products.findOne({ _id: productId });
    if (!product)
      return res.status(400).json({ message: "Product not found!" });
    const card = await Cards.findOne({ userId });
    if (!card) {
      const newCard = new Cards({
        userId: userId,
        products: [product._id],
      });

      await newCard.save();
      return res.status(200).json({ message: "Added to card" });
    }
    const prIds = card.products?.map((item) => item?.toString());
    if (prIds?.includes(product._id.toString()))
      return res.status(400).json({ message: "Product is already in card!" });

    await Cards.updateOne(
      { userId },
      {
        $push: {
          products: product._id,
        },
      }
    );

    res.status(200).json({ message: "Added to card" });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const deleteProductFromCard = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    await validateAsync(deleteProductFromCardSchema, { userId, productId });
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).json({ message: "User not found!" });
    const product = await Products.findOne({ _id: productId });
    if (!product)
      return res.status(400).json({ message: "Product not found!" });
    const card = await Cards.findOne({ userId });
    if (!card) return res.status(400).json({ message: "Card is empty!" });
    const prIds = card.products?.map((item) => item?.toString());
    if (!prIds.includes(productId))
      return res.status(400).json({ message: "Product is not in card!" });
    const filteredIds = prIds?.filter(
      (item) => item !== product._id.toString()
    );

    await Cards.updateOne(
      { userId },
      {
        $set: {
          products: filteredIds,
        },
      }
    );
    res.status(200).json({ message: "Product was deleted from card" });
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = {
  getCard,
  addToCard,
  deleteProductFromCard,
};
