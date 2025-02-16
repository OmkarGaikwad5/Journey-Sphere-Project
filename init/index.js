const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../Models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/JourneySphere";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
  } catch (err) {
    console.error("DB Connection Error:", err);
  }
}

const geometryData = [
  { type: "Point", coordinates: [40.712776, -74.005974] },
  { type: "Point", coordinates: [34.052235, -118.243683] },
  { type: "Point", coordinates: [51.507351, -0.127758] },
  { type: "Point", coordinates: [35.689487, 139.691711] },
  { type: "Point", coordinates: [48.856613, 2.352222] }
];

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    console.log("Existing listings removed.");

    const categories = ["Rooms", "Iconic Cities", "Mountain"];

    // Corrected category and geometry assignment
    const updatedData = initdata.data.map((obj, i) => ({
      ...obj,
      owner: "674c2ddff8b13f0651de6295",
      category: categories[i % categories.length],
      geometry: geometryData[i % geometryData.length]
    }));

    await Listing.insertMany(updatedData);
    console.log("Data was initialized successfully.");
  } catch (err) {
    console.error("Error initializing data:", err);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

// Execute database connection and data initialization
main().then(initDB);
