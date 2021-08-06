const express = require("express");
const router = express.Router();
const venues = require("../controllers/venues");

const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateVenue, isAuthor } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const Venue = require("../models/venue");

router
  .route("/")
  .get(catchAsync(venues.index))
  .post(
    isLoggedIn,
    validateVenue,
    upload.array("image"),
    catchAsync(venues.createVenue)
  );

router.get("/new", isLoggedIn, venues.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(venues.showVenue))
  .put(isLoggedIn, isAuthor, validateVenue, catchAsync(venues.editVenue))
  .delete(isLoggedIn, isAuthor, catchAsync(venues.deleteVenue));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(venues.renderEditForm)
);

module.exports = router;
