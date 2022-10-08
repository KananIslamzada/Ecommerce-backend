const express = require("express");
const router = express.Router();
const loginHandle = require("../controller/userLogin");
const registerHandle = require("../controller/userRegister");
const emailHandle = require("../controller/userEmailConfirm");
const {
  emailConfirm,
  resetHandle,
} = require("../controller/userResetPassword");

router.post("/register", registerHandle);

router.post("/login", loginHandle);

router.post("/emailConfirm", emailHandle);

router.post("/reset/emailConfirm", emailConfirm);

router.patch("/reset", resetHandle);

module.exports = router;
