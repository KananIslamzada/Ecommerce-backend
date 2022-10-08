const { validate, categorySchema } = require("../constants/Validations");
const Categories = require("../models/Categories");

const allCategories = async (_, res) => {
  try {
    const categories = await Categories.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const createCategory = async (req, res) => {
  const { name, bgColor, image } = req.body;

  const { error } = validate(categorySchema, { name, bgColor, image });
  if (error) return res.status(400).json(error);

  try {
    const newCategory = new Categories({
      name,
      bgColor,
      image,
    });
    await newCategory.save();
    res.status(200).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json(error);
  try {
    const { deletedCount } = await Categories.deleteOne({ _id: id });
    if (deletedCount) return res.sendStatus(200);
    return res.status(400).json({ message: "Category doesn't exists!" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = {
  allCategories,
  createCategory,
  deleteCategory,
};
