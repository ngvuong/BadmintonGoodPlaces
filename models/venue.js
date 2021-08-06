const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const VenueSchema = new Schema({
  name: String,
  price: Number,
  description: String,
  location: String,
  hours: String,
  images: [{ url: String, filename: String }],
  rental: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

VenueSchema.post("findOneAndDelete", async function (venue) {
  if (venue) {
    await Review.deleteMany({
      _id: {
        $in: venue.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Venue", VenueSchema);
