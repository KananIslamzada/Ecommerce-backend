const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { loginSchema, validateAsync } = require("../constants/Validations");
require("dotenv/config");

const loginHandle = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Email is not registered!" });

  try {
    const jwsResponse = jwt.verify(
      user.token,
      process.env.TOKEN_KEY,
      (err, _) => {
        if (err) return { message: "Invalid token", error: true };
      }
    );
    if (jwsResponse?.error) return res.status(400).json(jwsResponse);
    await validateAsync(loginSchema, { email, password });
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
