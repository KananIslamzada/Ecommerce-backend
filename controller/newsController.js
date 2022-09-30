const Joi = require("joi");
const News = require("../models/News");

const randomText =
  "The speaker unit contains a diaphragm that is precision-grown from NAC Audio bio-cellulose, making it stiffer, lighter and stronger than regular PET speaker units, and allowing the sound-producing diaphragm to vibrate without the levels of distortion found in other speakers. ";

const generateRandomId = () => Math.random() + Math.random();

const getAllNews = async (req, res) => {
  const page = req.params.page || 0;
  const numberSchema = Joi.number();
  const { error } = numberSchema.validate(page);
  if (error) return res.status(400).json(error);
  try {
    const limit = 10;
    const skip = parseInt(page) * limit;
    const news = await News.find().skip(skip).limit(limit);
    const count = await News.count();
    const next =
      count % (skip + limit) === count || (count === 0 && skip === 0)
        ? false
        : true;
    res.status(200).json({
      data: news,
      count,
      next,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const createNews = async (_, res) => {
  const news = new News({
    image: `https://picsum.photos/500/500?random=${generateRandomId()}`,
    title: `Test ${generateRandomId() * 1000}`,
    content: `${randomText}

    ${randomText}

    ${randomText}
    
    ${randomText}
    
    ${randomText}`,
  });
  try {
    await news.save();
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = {
  getAllNews,
  createNews,
};
