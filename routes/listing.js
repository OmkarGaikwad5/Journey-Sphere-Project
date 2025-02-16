if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const { upload } = require("../cloudConfig.js");

const listingController = require("../manager/listing.js");

const validateListing = (req, res, next) => {
  console.log(req.body);
  const { title, description, location, country, price, image } =
    req.body.listing;

  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router
  .route("/")
  .get(wrapAsync(listingController.index))
  // .post( isLoggedIn, validateListing, wrapAsync(listingController.createListing));
  .post(upload.single("listing[image]"), listingController.createListing);

router.get("/new", isLoggedIn, listingController.renderNewForm);
router.get("/category/:id", isLoggedIn, wrapAsync(listingController.categoryIndex))
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, wrapAsync(listingController.destroyListing));

router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
