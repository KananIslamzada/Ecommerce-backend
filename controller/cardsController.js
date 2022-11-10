const {
  validateAsync,
  Str,
  addToCardSchema,
  deleteProductFromCardSchema,
  sendCardsSchema,
} = require("../constants/Validations");
const Cards = require("../models/Cards");
const User = require("../models/User");
const Products = require("../models/Products");

const makeUnique=(arr=[],products)=>{
  const ids = arr?.map(item=>item?.product?.toString());
  const prIds = new Set(ids);
  const newArr = [...arr];

  for(let i=0;i<products.length;i++){
    const pr = products[i];
    const prId = pr.product;
    if(prIds.has(prId))continue;
    prIds.add(prId);
    newArr.push(pr);
  };

  return newArr;
}

const getCard = async (req, res) => {
  const { id } = req.params;
  try {
    await validateAsync(Str.required(), id);
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(400).json({ message: "User not found!" });
    const card = await Cards.findOne({ userId: id }).populate({
      path: "products.product",
      select: { __v: 0, description: 0, stockCount: 0, store: 0, photos: 0 },
    });
    if (!card) return res.status(200).json({ products: [] });
    res.status(200).json(card);
  } catch (error) {
    if (error.name === "CastError")
      return res.status(400).json({ message: "Id is incorrect!" });
    res.status(400).json(error);
  }
};

const addToCard = async (req, res) => {
  const { userId, products } = req.body;
  try {
    await validateAsync(addToCardSchema, { userId, products });
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).json({ message: "User not found!" });
    const product = await Products.findOne({ _id: products.product });
    if (!product)
      return res.status(400).json({ message: "Product not found!" });
    const card = await Cards.findOne({ userId });
    if (!card) {
      const newCard = new Cards({
        userId: userId,
        products: [products],
      });

      await newCard.save();
      return res.status(200).json({ message: "Added to card" });
    }
    const prIds = card.products?.map((item) => item?.product?.toString());
    if (prIds?.includes(product._id.toString()))
      return res.status(400).json({ message: "Product is already in card!" });

    await Cards.updateOne(
      { userId },
      {
        $push: {
          products: products,
        },
      }
    );

    res.status(200).json({ message: "Added to card" });
  } catch (error) {
    res.status(400).json(error);
  }
};

const sendCards = async (req, res) => {
  const { userId, products } = req.body;
  try {
    await validateAsync(sendCardsSchema, { userId, products });
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).json({ message: "User not found" });
    const card = await Cards.findOne({ userId });
    if (!card) {
      const newCard = new Cards({
        userId,
        products,
      });
      await newCard.save();
      return res.status(200).json({ message: "OK" });
    }

  const uniques = makeUnique(card.products,products);

    await Cards.updateOne(
      { userId },
      {
        $set: {
          products: uniques,
        },
      }
    );

    res.status(200).json({ message: "OK" });
  } catch (error) {
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
    const prIds = card.products?.map((item) => item?.product?.toString());
    if (!prIds.includes(productId))
      return res.status(400).json({ message: "Product is not in card!" });
  
      const filtered =  card.products?.filter(item=>item?.product?.toString() !==productId)

    await Cards.updateOne(
      { userId },
      {
        $set: {
          products: filtered,
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
  sendCards,
};
