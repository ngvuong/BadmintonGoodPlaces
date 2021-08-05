const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateVenue, isAuthor } = require("../middleware");

const Venue = require("../models/venue");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const venues = await Venue.find({});
    res.render("venues/index", { venues });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("venues/new");
});

router.post(
  "/",
  isLoggedIn,
  validateVenue,
  catchAsync(async (req, res) => {
    const venue = new Venue(req.body.venue);
    venue.author = req.user.id;
    await venue.save();
    req.flash("success", "Successfully created venue!");
    res.redirect(`/venues/${venue.id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const venue = await Venue.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
    if (!venue) {
      req.flash("error", "Venue not found!");
      return res.redirect("/venues");
    }
    res.render("venues/show", { venue });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const venue = await Venue.findById(id);
    if (!venue) {
      req.flash("error", "Venue not found!");
      return res.redirect("/venues");
    }

    res.render("venues/edit", { venue });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateVenue,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    const venue = await Venue.findByIdAndUpdate(
      id,
      { ...req.body.venue },
      {
        runValidators: true,
        new: true,
      }
    );
    req.flash("success", "Successfully updated venue");
    res.redirect(`/venues/${venue.id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    await Venue.findByIdAndDelete(id);
    req.flash("success", "Deleted venue!");
    res.redirect(`/venues`);
  })
);

module.exports = router;
