const express = require("express");
const router = express.Router();
const loginHandle = require("../controller/userLogin");
const registerHandle = require("../controller/userRegister");
const emailHandle = require("../controller/userEmailConfirm");

router.post("/register", registerHandle);

router.post("/login", loginHandle);

router.post("/emailConfirm", emailHandle);

module.exports = router;
