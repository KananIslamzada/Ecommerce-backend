const User = require("../models/User");
const nodemailer = require("nodemailer");
const Joi = require("joi");
require("dotenv/config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.CONFIRMATION_EMAIL,
    pass: process.env.CONFIRMATION_EMAIL_PASS,
  },
});

const generateFourDigit = () => {
  const code = Math.floor(1000 + Math.random() * 9000);
  return code;
};

const emailHandle = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required!" });
  const user = await User.findOne({ email });
  const emailSchema = Joi.string().email();
  const { error } = emailSchema.validate(email);
  if (error) return res.status(400).json({ message: "Email is not valid!" });
  if (user) return res.status(400).json({ message: "Email is already exists" });
  const randomDigit = generateFourDigit();

  const mailOptions = {
    from: process.env.CONFIRMATION_EMAIL,
    to: email,
    subject: "Confirmation Code!",
    text: `Here is your code: ${randomDigit}
Expires in 5 minutes!!`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error)
      return res.status(500).json({ message: "Something went wrong!" });
    const currentTime = new Date();
    res.status(200).json({ code: randomDigit, date: currentTime });
  });
};

module.exports = emailHandle;
