const {
  validateAsync,
  updateProfileSchema,
} = require("../constants/Validations");
const User = require("../models/User");

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

module.exports = {
  updateProfile,
};
