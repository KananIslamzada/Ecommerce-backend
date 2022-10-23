const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getWishes,
  createWish,
  sendWishes,
  deleteWish,
} = require("../controller/wishlistController");

router.get("/:id?", auth, getWishes);

router.post("/create", auth, createWish);

router.post("/send", sendWishes);

router.delete("/delete", auth, deleteWish);

module.exports = router;
