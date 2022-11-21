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
const { updateProfile, updatePassword } = require("../controller/userProfileController");

router.post("/register", registerHandle);

router.post("/login", loginHandle);

router.post("/emailConfirm", emailHandle);

router.post("/reset/emailConfirm", emailConfirm);

router.patch("/reset", resetHandle);

router.patch("/update", auth, updateProfile);

router.patch("/u", auth, updatePassword)

module.exports = router;
