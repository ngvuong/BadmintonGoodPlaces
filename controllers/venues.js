const Venue = require("../models/venue");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  const venues = await Venue.find({});
  res.render("venues/index", { venues });
};

module.exports.renderNewForm = (req, res) => {
  res.render("venues/new");
};

module.exports.createVenue = async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({ query: req.body.venue.location, limit: 1 })
    .send();
  console.log(process.env);

  const venue = new Venue(req.body.venue);
  venue.geometry = geoData.body.features[0].geometry;
  venue.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  venue.author = req.user.id;
  await venue.save();
  console.log(venue);
  req.flash("success", "Successfully created venue!");
  res.redirect(`/venues/${venue.id}`);
};

module.exports.showVenue = async (req, res) => {
  const { id } = req.params;
  const venue = await Venue.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!venue) {
    req.flash("error", "Venue not found!");
    return res.redirect("/venues");
  }
  res.render("venues/show", { venue });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const venue = await Venue.findById(id);
  if (!venue) {
    req.flash("error", "Venue not found!");
    return res.redirect("/venues");
  }

  res.render("venues/edit", { venue });
};

module.exports.editVenue = async (req, res) => {
  const { id } = req.params;

  const venue = await Venue.findByIdAndUpdate(
    id,
    { ...req.body.venue },
    {
      runValidators: true,
      new: true,
    }
  );
  const images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  venue.images.push(...images);
  await venue.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await venue.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated venue");
  res.redirect(`/venues/${venue.id}`);
};

module.exports.deleteVenue = async (req, res) => {
  const { id } = req.params;
  venue = await Venue.findById(id);
  if (venue.images) {
    for (let filename of venue.images) {
      await cloudinary.uploader.destroy(filename);
    }
  }

  await Venue.findByIdAndDelete(id);
  req.flash("success", "Deleted venue!");
  res.redirect(`/venues`);
};
