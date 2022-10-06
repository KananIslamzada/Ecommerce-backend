const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const newsRouter = require("./routes/news");
const categoriesRouter = require("./routes/categories");
require("dotenv/config");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/user", userRouter);
app.use("/news", newsRouter);
app.use("/categories", categoriesRouter);

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
