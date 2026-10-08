require("node:dns").setServers(["8.8.8.8", "1.1.1.1"]);
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const crypto = require("crypto");
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");
const geocode = require("../utils/geocode.js");

const dbUrl = process.env.MONGO_URI;

// Listings need an owner, so the seed creates a demo host account.
// Its password is random unless SEED_USER_PASSWORD is set in .env.
async function getSeedOwner() {
  const username = "stayscape_host";
  let user = await User.findOne({ username });
  if (!user) {
    const password =
      process.env.SEED_USER_PASSWORD || crypto.randomBytes(16).toString("hex");
    user = await User.register(
      new User({ username, email: "host@stayscape.local" }),
      password
    );
    console.log(`Created demo host user "${username}"`);
  }
  return user;
}

const initDB = async () => {
  if (!process.env.MAP_TOKEN) {
    console.log("MAP_TOKEN not set: listings will be seeded without map locations.");
  }

  const owner = await getSeedOwner();

  await Listing.deleteMany({});
  await Review.deleteMany({});
  console.log("Old data deleted!");

  for (let obj of initData.data) {
    const newListing = new Listing({ ...obj, owner: owner._id });
    const geometry = await geocode(obj.location);
    if (geometry) {
      newListing.geometry = geometry;
    }
    await newListing.save();
    console.log(`Added listing: ${obj.title}`);
  }

  console.log("data was initialized");
};

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("connected to DB");
    return initDB();
  })
  .catch((err) => {
    console.log(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.connection.close());
