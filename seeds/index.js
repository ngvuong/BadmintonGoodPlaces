const mongoose = require("mongoose");
const Venue = require("../models/venue");
const Review = require("../models/review");
const cities = require("./cities");
const { places } = require("./seedHelpers");

require("dotenv").config();
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

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
  await Review.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const rand = Math.floor(Math.random() * 1000);
    const rental = Math.floor(Math.random() * 2);
    const price = Math.floor(Math.random() * 21) + 5;
    const geoData = await geocoder
      .forwardGeocode({
        query: `${cities[rand].city}, ${cities[rand].state}`,
        limit: 1,
      })
      .send();
    const venue = new Venue({
      author: "610a5798ed0f3a670219c315",
      rental: rental === 1 ? "Yes" : "No",
      location: `${cities[rand].city}, ${cities[rand].state}`,
      geometry: geoData.body.features[0].geometry,
      name: `${cities[rand].city} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dszjo28hy/image/upload/v1628226893/BGP/cuphw22x8ctoikdfwuep.jpg",
          filename: "BGP/cuphw22x8ctoikdfwuep",
        },
        {
          url: "https://res.cloudinary.com/dszjo28hy/image/upload/v1628226895/BGP/kf4wz4kv5kzyraf0vmbk.jpg",
          filename: "BGP/kf4wz4kv5kzyraf0vmbk",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem voluptatum atque sunt molestiae saepe ipsam dolorem. Ipsa eveniet, reprehenderit corrupti vitae quo voluptatum praesentium. Qui labore ipsam quia blanditiis ipsum.",
      price,
    });
    await venue.save();
  }
};

seedDB().then(() => mongoose.connection.close());
