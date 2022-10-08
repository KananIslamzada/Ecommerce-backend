const {
  validate,
  Email,
  loginSchema,
  validateAsync,
} = require("../constants/Validations");
const mail = require("../middleware/sendEmail");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv/config");

const resetHandle = async (req, res) => {
  const { email, password } = req.body;
  try {
    await validateAsync(loginSchema, { email, password });
    const hashPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email }, process.env.TOKEN_KEY, {
      expiresIn: "365 days",
    });

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          password: hashPassword,
          token,
        },
      }
    );

    if (!updatedUser)
      return res.status(400).json({ message: "User not found!" });

    const userObj = updatedUser.toObject();
    userObj.token = token;
    delete userObj.password;
    res.status(201).json(userObj);
  } catch (error) {
    res.status(500).json(error);
  }
};

const emailConfirm = async (req, res) => {
  const { email } = req.body;
  try {
    const { error } = validate(Email.required(), email);
    if (error) return res.status(400).json(error);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not registered!" });

    mail(email, res);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = {
  emailConfirm,
  resetHandle,
};