const mongoose = require("mongoose");
const Venue = require("../models/venue");
const cities = require("./cities");
const { places } = require("./seedHelpers");

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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Venue.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const rand = Math.floor(Math.random() * 1000);
    const venue = new Venue({
      location: `${cities[rand].city}, ${cities[rand].state}`,
      name: `${cities[rand].city} ${sample(places)}`,
    });
    await venue.save();
  }
};

seedDB().then(() => mongoose.connection.close());