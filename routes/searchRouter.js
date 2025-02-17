if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const router = express.Router();

const searchController = require("../manager/search.js");

router.route("/:query").get(searchController.index);

// .post( isLoggedIn, validateListing, wrapAsync(listingController.createListing));

module.exports = router;
