const express = require("express");
const {
  getCard,
  addToCard,
  deleteProductFromCard,
  sendCards,
} = require("../controller/cardsController");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/:id?", auth, getCard);

router.post("/", auth, addToCard);

router.post("/send", sendCards);

router.delete("/delete", auth, deleteProductFromCard);

module.exports = router;
