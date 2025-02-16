const Listing = require("../Models/listing.js");
const Review = require("../Models/review.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};
module.exports.categoryIndex = async (req, res) => {
  const { id } = req.params;
  const allListings = await Listing.find({ category: id });
  res.render("listings/index.ejs", { allListings });
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

  console.log(listing);

  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  const { listing } = req.body;
  console.log(listing);
  // let response = await geocodingClient.forwardGeocode({
  //   query: req.body.listing.location,
  //   limit: 1,
  // })
  //   .send();

  const { title, description, image, price, country, location, category } =
    listing;
  if (!(req.user && req.user._id)) {
    req.flash("error", "User is not Authenticated");
    return res.redirect("/listings");
  }
  let newListings;
  if (req.file && req.file.path !== "") {
    const newImage = {
      url: req.file.path,
    };
    console.log(newImage);
    newListings = new Listing({
      title,
      description,
      image: newImage,
      price,
      country,
      location,
      category: category,
    });
  } else {
    newListings = new Listing({
      title,
      description,
      price,
      country,
      location,
      category: category,
    });
  }

  // Assign owner BEFORE saving
  newListings.owner = req.user._id;
  console.log(req.user);

  // newListings.geometry = response.body.features[0].geometry;
  newListings.geometry = {
    type: "Point",
    coordinates: [40.712776, -74.005974],
  };
  // Save the listing to the database
  let savedListing = await newListings.save();
  console.log(savedListing);
  // Add success flash message
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
 const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const { listing } = req.body;
  const { title, description, price, location, country } = listing;

  if (req.file && req.file.path) {
    const newImage = {
      url: req.file.path,
    };
    await Listing.findByIdAndUpdate(id, {
      price,
      location,
      country,
      title,
      description,
      image: newImage,
    });
  } else {
    await Listing.findByIdAndUpdate(id, {
      price,
      location,
      country,
      title,
      description,
    });
    
  }

  const baseUrl = req.baseUrl;
  req.flash("success", "Listing Updated");
  res.redirect(baseUrl + "/" + id );
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", " Listing Deleted");
  res.redirect("/listings");
};
