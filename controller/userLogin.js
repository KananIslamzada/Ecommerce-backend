const Joi = require("joi");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const loginHandle = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Email is not registered!" });
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  try {
    await loginSchema.validateAsync({ email, password });
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res
        .status(400)
        .json({ message: "Email or password is incorrect!" });

    const userObj = user.toObject();
    delete userObj.password;
    res.status(200).json(userObj);
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = loginHandle;
