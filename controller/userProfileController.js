const {
  validateAsync,
  updateProfileSchema,
  updatePasswordSchema,
  Str,
} = require("../constants/Validations");
const User = require("../models/User");
const bcrypt = require('bcrypt');
require("dotenv/config");
const cloudinary = require('cloudinary').v2;
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

const updatePassword = async (req, res) => {
  const { oldPassword, password, passwordAgain, userId } = req.body;
  try {
    await validateAsync(updatePasswordSchema, { oldPassword, password, passwordAgain, userId })
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).json({ message: "User not found" });

    const matched = await bcrypt.compare(oldPassword, user.password)
    if (!matched) return res.status(400).json({ message: "Please enter correct password" });
    const hashed = await bcrypt.hash(password, 10);

    await User.updateOne({ _id: userId }, {
      $set: {
        password: hashed
      }
    });

    res.status(200).json({ message: "Password changed" });

  } catch (error) {
    res.status(400).json(error)
  }
}

const checkError = async (user, data) => {
  const { username, email } = data;
  if (username === user.username)
    throw { message: "Username can not be the same!" };
  if (email === user.email) throw { message: "Email can not be the same!" };
  const hasUsername = await User.findOne({ username });
  if (hasUsername) throw { message: "This username is already exists" };
  const hasEmail = await User.findOne({ email });
  if (hasEmail) throw { message: "This email is already exists " };
};

const updateProfile = async (req, res) => {
  const data = req.body;
  try {
    await validateAsync(updateProfileSchema, data);
    const user = await User.findOne({ _id: data.userId });
    if (!user) return res.status(400).json({ message: "User not found!" });
    await checkError(user, data);
    const newData = { ...data };
    delete newData.userId;
    await User.updateOne(
      { _id: data.userId },
      {
        $set: newData,
      }
    );
    res.status(200).json({ message: "Profile was updated!" });
  } catch (error) {
    if (error.name === "CastError")
      return res.status(400).json({ message: "Id is incorrect!" });
    res.status(400).json(error);
  }
};

const updateImage = async (req, res) => {
  const { userId } = req.body;
  const { image } = req.files;
  try {
    await validateAsync(Str, userId);

    if (!image) return res.status(400).json({ message: "Image is required" });
    if (!/^image/.test(image.mimetype)) return res.status(400).json({ message: "Must be valid image type" });
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).json({ message: "User not found!" });

    await image.mv(`${appDir}/upload/${image.name}`)
    await cloudinary.uploader.destroy(`${userId}`, resource_type = "image");
    const cloudUpload = await cloudinary.uploader.upload(`${appDir}/upload/${image.name}`, {
      resource_type: "image",
      public_id: `${userId}`,
    })

    await User.updateOne({ _id: userId }, {
      $set: {
        profilePicture: cloudUpload.secure_url
      }
    })

    return res.status(200).json({ message: "Profile picture updated!" })
  } catch (error) {
    return res.status(400).json(error);
  }

}

module.exports = {
  updateProfile,
  updatePassword,
  updateImage
};
