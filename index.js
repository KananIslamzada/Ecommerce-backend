const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const newsRouter = require("./routes/news");
const categoriesRouter = require("./routes/categories");
const reviewsRouter = require("./routes/reviews");
const productsRouter = require("./routes/products");
const storesRouter = require("./routes/stores");
const wishlistsRouter = require("./routes/wishlist");
const cardsRouter = require("./routes/cards");
const checkoutsRouter = require("./routes/checkouts");
require("dotenv/config");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/user", userRouter);
app.use("/news", newsRouter);
app.use("/categories", categoriesRouter);
app.use("/reviews", reviewsRouter);
app.use("/products", productsRouter);
app.use("/stores", storesRouter);
app.use("/wishlists", wishlistsRouter);
app.use("/cards", cardsRouter);
app.use("/checkouts", checkoutsRouter);

app.get("/", (_, res) => {
  res.send("This is home");
});

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true });

const db = mongoose.connection;

db.on("open", () => {
  console.log("Connected to ", process.env.DB_CONNECTION);
});

db.on("error", (err) => {
  console.log({ err });
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`Listening port ${process.env.PORT || 3000}...`)
);
