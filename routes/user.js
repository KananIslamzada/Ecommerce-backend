const express = require("express");
const router = express.Router();
const loginHandle = require("../controller/userLogin");
const registerHandle = require("../controller/userRegister");
const emailHandle = require("../controller/userEmailConfirm");
const {
  emailConfirm,
  resetHandle,
} = require("../controller/userResetPassword");
const auth = require("../middleware/auth");
const { updateProfile, updatePassword, updateImage } = require("../controller/userProfileController");

router.post("/register", registerHandle);

router.post("/login", loginHandle);

router.post("/emailConfirm", emailHandle);

router.post("/reset/emailConfirm", emailConfirm);

router.patch("/reset", resetHandle);

router.patch("/update", auth, updateProfile);

router.patch("/updatePassword", auth, updatePassword);

router.patch("/updateImage", auth, updateImage)

module.exports = router;
