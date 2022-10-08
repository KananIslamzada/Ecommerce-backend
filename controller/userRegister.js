const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { validateAsync, userSchema } = require("../constants/Validations");
require("dotenv/config");

const handleUser = async (req, res) => {
  const { username, email, password } = req.body;
  const hasUser = await User.findOne({ email });
  if (hasUser)
    return res.status(400).json({ error: "This email is already exists" });

  try {
    const value = await validateAsync(userSchema, {
      username,
      email,
      password,
    });
    const hashPassword = await bcrypt.hash(value.password, 10);
    const token = jwt.sign({ email: value.email }, process.env.TOKEN_KEY, {
      expiresIn: "365 days",
    });
    const newUser = new User({
      username: value.username,
      email: value.email,
      password: hashPassword,
      token: token,
    });

    await newUser.save();
    const userObj = newUser.toObject();
    delete userObj.password;
    res.status(201).json(userObj);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = handleUser;
