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
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/venues", async (req, res) => {
  const venues = await Venue.find({});
  res.render("venues/index", { venues });
});

app.get("/venues/new", (req, res) => {
  res.render("venues/new");
});

app.post("/venues", async (req, res) => {
  const venue = new Venue(req.body.venue);
  await venue.save();
  res.redirect(`venues/${venue.id}`);
});

app.get("/venues/:id", async (req, res) => {
  const { id } = req.params;
  const venue = await Venue.findById(id);
  res.render("venues/show", { venue });
});

app.listen("3000", () => {
  console.log("Listening on 3000");
});
