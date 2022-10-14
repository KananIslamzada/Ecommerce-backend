const express = require("express");
const {
  getStore,
  createStore,
  deleteStore,
  getStores,
} = require("../controller/storesController");
const router = express.Router();

router.get("/store/:id?", getStore);

router.get("/", getStores);

router.post("/create", createStore);

router.delete("/delete/:id?", deleteStore);

module.exports = router;
