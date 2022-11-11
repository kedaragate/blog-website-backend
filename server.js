const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const dbConfig = require(path.join(__dirname, "./app/dbconfig/db.config"));

const blogRoutes = require(path.join(__dirname, "./app/routes/blogs.routes"));
const userRoutes = require(path.join(__dirname, "./app/routes/user.routes"));

const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());

app.use(bodyParser.json());

mongoose.connect(dbConfig.url);

let db = mongoose.connection;

db.on("error", () => {
  console.log("error in db connection");
});
db.once("open", () => {
  console.log("db connection successful");
});

blogRoutes(app);

userRoutes(app);

app.listen(process.env.PORT, () => {
  console.log(`Server running at ${process.env.PORT}`);
});
