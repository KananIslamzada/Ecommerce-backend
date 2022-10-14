const express = require("express");
const {
  getStore,
  createStore,
  deleteStore,
} = require("../controller/storesController");
const router = express.Router();

router.get("/store/:id?", getStore);

router.post("/create", createStore);

router.delete("/delete/:id?", deleteStore);

module.exports = router;
