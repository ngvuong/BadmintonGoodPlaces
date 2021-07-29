const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Joi = require("joi");
const { venueSchema } = require("./schemas");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
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

const validateVenue = (req, res, next) => {
  const { error } = venueSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((ele) => ele.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/venues",
  catchAsync(async (req, res) => {
    const venues = await Venue.find({});
    res.render("venues/index", { venues });
  })
);

app.get("/venues/new", (req, res) => {
  res.render("venues/new");
});

app.post(
  "/venues",
  validateVenue,
  catchAsync(async (req, res) => {
    const venue = new Venue(req.body.venue);
    await venue.save();
    res.redirect(`/venues/${venue.id}`);
  })
);

app.get(
  "/venues/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const venue = await Venue.findById(id);
    res.render("venues/show", { venue });
  })
);

app.get(
  "/venues/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const venue = await Venue.findById(id);
    if (venue) {
      res.render("venues/edit", { venue });
    }
  })
);

app.put(
  "/venues/:id",
  validateVenue,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const venue = await Venue.findByIdAndUpdate(
      id,
      { ...req.body.venue },
      {
        useFindAndModify: false,
        runValidators: true,
        new: true,
      }
    );
    res.redirect(`/venues/${venue.id}`);
  })
);

app.delete(
  "/venues/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Venue.findByIdAndDelete(id);
    res.redirect(`/venues`);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("error", { err });
});

app.listen("3000", () => {
  console.log("Listening on 3000");
});
