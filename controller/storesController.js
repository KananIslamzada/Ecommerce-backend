const Stores = require("../models/Stores");
const {
  validateAsync,
  storeSchema,
  validate,
  Str,
} = require("../constants/Validations");
const Reviews = require("../models/Reviews");
const Products = require("../models/Products");

const getStores = async (_, res) => {
  try {
    const stores = await Stores.find();
    const count = await Stores.count();
    res.status(200).json({ data: stores, count });
  } catch (error) {
    res.status(400).json(error);
  }
};

const getStore = async (req, res) => {
  const { id } = req.params;
  const { error } = validate(Str.required(), id);
  if (error) return res.status(400).json(error);
  try {
    const store = await Stores.findOne({ _id: id })
      .populate({
        path: "products",
        select: { store: 0, __v: 0 },
        populate: {
          path: "reviews",
          module: "reviews",
          select: { __v: 0 },
        },
      })
      .populate("reviews", "starCount")
      .select({ __v: 0 });
    if (!store) return res.status(400).json({ message: "Store not found!" });
    const storeObj = store.toObject();
    const hasReviewLength = !!storeObj.reviews.length;
    const averageStarCount = hasReviewLength
      ? storeObj.reviews.reduce((acc, val) => acc + val.starCount, 0) /
        storeObj.reviews.length
      : null;
    storeObj.averageStarCount = averageStarCount?.toFixed(1) || null;
    res.status(200).json(storeObj);
  } catch (error) {
    res.status(400).json(error);
  }
};

const createStore = async (req, res) => {
  const store = req.body;
  try {
    await validateAsync(storeSchema, store);
    const newStore = new Stores(store);
    await newStore.save();
    res.status(201).json(newStore);
  } catch (error) {
    if (error.code === 11000)
      return res
        .status(400)
        .json({ message: `${error.keyValue.name} is already exists!` });
    res.status(400).json(error);
  }
};

const deleteStore = async (req, res) => {
  const { id } = req.params;
  const { error } = validate(Str.required(), id);
  if (error) return res.status(400).json(error);
  try {
    const store = await Stores.findOneAndDelete({ _id: id });
    if (!store) return res.status(400).json({ message: "Store not found!" });
    await Products.deleteMany({ _id: { $in: store?.products } });
    await Reviews.deleteMany({ _id: { $in: store?.reviews } });

    res.status(200).json({ message: "Store was deleted!" });
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = {
  getStore,
  createStore,
  deleteStore,
  getStores,
};
