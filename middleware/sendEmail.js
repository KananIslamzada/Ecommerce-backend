const nodemailer = require("nodemailer");
require("dotenv/config");

const generateFourDigit = () => {
  const code = Math.floor(1000 + Math.random() * 9000);
  return code;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.CONFIRMATION_EMAIL,
    pass: process.env.CONFIRMATION_EMAIL_PASS,
  },
});

const mail = async (email, res) => {
  const randomDigit = generateFourDigit();
  const mailOptions = {
    from: process.env.CONFIRMATION_EMAIL,
    to: email,
    subject: "Confirmation Code!",
    text: `Here is your code: ${randomDigit}
        Expires in 5 minutes!!`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error)
      return res.status(500).json({ message: "Something went wrong!" });
    const currentTime = new Date();
    res.status(200).json({ code: randomDigit, date: currentTime });
  });
};

module.exports = mail;
