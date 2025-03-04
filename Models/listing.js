const mongoose = require("mongoose");
const Review = require("./review.js");
const { required } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
      type: String,
      required: true,
    },
    description: String,
    image: {
        url: {
          type: String,
          default:
            "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Review'
      }
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    category: {
      type: String,
      required: true
    }
    
    // geometry : {
    //   type: {
    //     type: String, // Don't do `{ location: { type: String } }`
    //     enum: ['Point'], // 'location.type' must be 'Point'
    //     required: true
    //   },
    //   coordinates: {
    //     type: [Number],
    //     required: true
    //   }
    // }
});

listingSchema.post("findOneAndDelete",async(listing) =>{
 if(listing){
  await Review.deleteMany({_id: { $in: listing.reviews}});
 }
});

module.exports = mongoose.model('Listing', listingSchema);