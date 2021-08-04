const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const Venue = require("../models/venue");
const { venueSchema } = require("../schemas");

const validateVenue = (req, res, next) => {
  const { error } = venueSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((ele) => ele.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const venues = await Venue.find({});
    res.render("venues/index", { venues });
  })
);

router.get("/new", (req, res) => {
  res.render("venues/new");
});

router.post(
  "/",
  validateVenue,
  catchAsync(async (req, res) => {
    const venue = new Venue(req.body.venue);
    await venue.save();
    req.flash("success", "Successfully created venue!");
    res.redirect(`/venues/${venue.id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const venue = await Venue.findById(id).populate("reviews");
    if (!venue) {
      req.flash("error", "Venue not found!");
      return res.redirect("/venues");
    }
    res.render("venues/show", { venue });
  })
);

router.get(
  "/:id/edit",
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
  catchAsync(async (req, res) => {
    const { id } = req.params;

    await Venue.findByIdAndDelete(id);
    req.flash("success", "Deleted venue!");
    res.redirect(`/venues`);
  })
);

module.exports = router;
