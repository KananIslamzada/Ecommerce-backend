const jwt = require("jsonwebtoken");
require("dotenv/config");

const auth = async (req, res, next) => {
  const token = req.header("authorization");
  if (!token)
    return res.status(400).json({ message: "Login required", code: "auth" });
  jwt.verify(token, process.env.TOKEN_KEY, (err) => {
    if (!err) return next();
    return res.status(400).json({ message: "Invalid token", code: "auth" });
  });
};

module.exports = auth;
