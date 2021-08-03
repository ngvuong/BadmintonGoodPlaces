const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VenueSchema = new Schema({
  name: String,
  price: Number,
  description: String,
  location: String,
  hours: String,
  image: String,
  rentals: Boolean,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

module.exports = mongoose.model("Venue", VenueSchema);
