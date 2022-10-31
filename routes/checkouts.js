const express = require("express");
const {
  getCheckout,
  sendCheckout,
} = require("../controller/checkoutsController");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/all", auth, getCheckout);

router.post("/send", auth, sendCheckout);

module.exports = router;
