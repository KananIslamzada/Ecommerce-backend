const {
  validateAsync,
  sendCheckoutSchema,
} = require("../constants/Validations");
const Checkouts = require("../models/Checkouts");
const User = require("../models/User");

const sendCheckout = async (req, res) => {
  const { userId, products } = req.body;
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).json({ message: "User not found!" });
    await validateAsync(sendCheckoutSchema, { userId, products });
    const checkout = await Checkouts.findOne({ userId });
    if (!checkout) {
      const newCheckout = new Checkouts({
        userId,
        products,
      });

      await newCheckout.save();

      return res.status(200).json(newCheckout);
    }

    const newProducts = [...checkout.products, ...products];
    await Checkouts.updateOne(
      { userId: user._id },
      {
        $set: {
          products: newProducts,
        },
      }
    );

    res.status(200).json({ message: "Ok" });
  } catch (error) {
    res.status(400).json(error);
  }
};

const getCheckout = async (req, res) => {
  const token = req.headers.authorization;
  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(400).json({ message: "User not found!" });
    const checkout = await Checkouts.findOne({ userId: user._id }).populate({
      path: "products.productId",
      select: {
        name: 1,
        _id: 1,
        isSale: 1,
        salePrice: 1,
        price: 1,
        coverPhoto: 1,
        reviews: 1,
      },
    });
    res.status(200).json(checkout);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = {
  sendCheckout,
  getCheckout,
};
