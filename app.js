const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Venue = require("./models/venue");

mongoose.connect("mongodb://localhost:27017/badminton-venue", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.get("/", (req, res) => {
  res.render("home");


app.get("/venues", (req, res) => {
  const venues = await Venues.find({})
  res.render('venues/index', {venues})
});



app.listen("3000", () => {
  console.log("Listening on 3000");
});
