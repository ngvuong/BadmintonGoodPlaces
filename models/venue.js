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
});

module.exports = mongoose.model("Venue", VenueSchema);
