const express = require("express");
const { getAllNews, createNews } = require("../controller/newsController");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/:page?", getAllNews);

router.post("/create", createNews);
module.exports = router;
