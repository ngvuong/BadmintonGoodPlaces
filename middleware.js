const { venueSchema, reviewSchema } = require("./schemas");

const ExpressError = require("./utils/ExpressError");
const Venue = require("./models/venue");
const Review = require("./models/review");

module.exports.isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateVenue = (req, res, next) => {
  const { error } = venueSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((ele) => ele.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((ele) => ele.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const venue = await Venue.findById(id);
  if (!venue.author.equals(req.user.id)) {
    req.flash("error", "You do not have permission!");
    return res.redirect(`/venues/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user.id)) {
    req.flash("error", "You do not have permission!");
    return res.redirect(`/venues/${id}`);
  }
  next();
};
