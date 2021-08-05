const express = require("express");
const router = express.Router();
const venues = require("../controllers/venues");

const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateVenue, isAuthor } = require("../middleware");

const Venue = require("../models/venue");

router.get("/", catchAsync(venues.index));

router.get("/new", isLoggedIn, venues.renderNewForm);

router.post("/", isLoggedIn, validateVenue, catchAsync(venues.createVenue));

router.get("/:id", catchAsync(venues.showVenue));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(venues.renderEditForm)
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateVenue,
  catchAsync(venues.editVenue)
);

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(venues.deleteVenue));

module.exports = router;
