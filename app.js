const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const Venue = require("./models/venue");
const methodOverride = require("method-override");

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

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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
  res.redirect(`/venues/${venue.id}`);
});

app.get("/venues/:id", async (req, res) => {
  const { id } = req.params;
  const venue = await Venue.findById(id);
  res.render("venues/show", { venue });
});

app.get("/venues/:id/edit", async (req, res) => {
  const { id } = req.params;
  const venue = await Venue.findById(id);
  if (venue) {
    res.render("venues/edit", { venue });
  }
});

app.put("/venues/:id", async (req, res) => {
  const { id } = req.params;
  const venue = await Venue.findByIdAndUpdate(
    id,
    { ...req.body.venue },
    {
      runValidators: true,
      new: true,
    }
  );
  res.redirect(`/venues/${venue.id}`);
});

app.delete("/venues/:id", async (req, res) => {
  const { id } = req.params;
  await Venue.findByIdAndDelete(id);
  res.redirect(`/venues`);
});

app.listen("3000", () => {
  console.log("Listening on 3000");
});
