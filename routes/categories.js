const express = require("express");
const {
  allCategories,
  createCategory,
  deleteCategory,
} = require("../controller/categoryController");
const router = express.Router();

router.get("/", allCategories);

router.post("/create", createCategory);

router.delete("/delete/:id", deleteCategory);

module.exports = router;
