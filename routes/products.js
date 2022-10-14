const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
} = require("../controller/productController");

const router = express.Router();

router.get("/:page?", getProducts);

router.get("/product/:id", getProduct);

router.post("/create", createProduct);

router.delete("/delete/:id?", deleteProduct);

module.exports = router;
