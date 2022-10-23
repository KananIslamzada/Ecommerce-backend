const express = require("express");
const {
  getCard,
  addToCard,
  deleteProductFromCard,
} = require("../controller/cardsController");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/:id?", auth, getCard);

router.post("/", auth, addToCard);

router.delete("/delete", auth, deleteProductFromCard);

module.exports = router;
