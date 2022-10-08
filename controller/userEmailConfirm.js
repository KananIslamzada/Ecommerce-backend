const User = require("../models/User");
const { validate, Email } = require("../constants/Validations");
const mail = require("../middleware/sendEmail");

const emailHandle = async (req, res) => {
  const { email } = req.body;
  const { error } = validate(Email.required(), email);
  if (error) return res.status(400).json(error);

  const user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: "Email is already exists" });
  mail(email, res);
};

module.exports = emailHandle;
