const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.listen("3000", () => {
  console.log("Listening on 3000");
});
