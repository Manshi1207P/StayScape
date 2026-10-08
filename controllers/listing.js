const Listing = require("../models/listing.js");
const geocode = require("../utils/geocode.js");

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings, searchQuery: "" });
};

// Search by title, location or country (case-insensitive)
module.exports.searchListing = async (req, res) => {
  const searchQuery = String(req.query.q || "").trim();
  if (!searchQuery) {
    return res.redirect("/listings");
  }
  const regex = new RegExp(escapeRegex(searchQuery), "i");
  const allListings = await Listing.find({
    $or: [{ title: regex }, { location: regex }, { country: regex }],
  });
  if (allListings.length === 0) {
    req.flash("error", `No listings found for "${searchQuery}".`);
    return res.redirect("/listings");
  }
  res.render("listings/index.ejs", { allListings, searchQuery });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "The listing you requested does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  // Image is optional: without an upload the schema's default image is used
  if (req.file) {
    newListing.image = { url: req.file.path, filename: req.file.filename };
  }

  const geometry = await geocode(newListing.location);
  if (geometry) {
    newListing.geometry = geometry;
  }

  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "The listing you requested does not exist!");
    return res.redirect("/listings");
  }
  // Cloudinary URLs can be resized by inserting a transformation
  let originalImageUrl = listing.image.url.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  if (req.file) {
    listing.image = { url: req.file.path, filename: req.file.filename };
  }

  const geometry = await geocode(listing.location);
  if (geometry) {
    listing.geometry = geometry;
  }

  await listing.save();
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
