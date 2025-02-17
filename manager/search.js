const Listing = require("../Models/listing.js");
const Review = require("../Models/review.js");


module.exports.index = async (req, res) => {
    const { query: search } = req.params; // Extract search query from request
  
    let query = {};
    if (search) {
        query = {
            $or: [
                { title: { $regex: search, $options: "i" } }, // Case-insensitive search in title
                { description: { $regex: search, $options: "i" } }, // Case-insensitive search in description
                { location: { $regex: search, $options: "i" } } // Case-insensitive search in location
            ]
        };
    }

    const allListings = await Listing.find(query);
    res.render("listings/index.ejs", { allListings });
};
