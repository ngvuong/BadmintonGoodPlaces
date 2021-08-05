const Review = require("../models/review");
const Venue = require("../models/venue");

module.exports.createReview = async (req, res) => {
  const venue = await Venue.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user.id;
  venue.reviews.push(review);
  await review.save();
  await venue.save();
  req.flash("success", "New review added!");
  res.redirect(`/venues/${venue.id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Venue.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Deleted review!");
  res.redirect(`/venues/${id}`);
};
