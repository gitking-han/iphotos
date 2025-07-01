
const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://hanzalarehman804:GOOq484YTa0HsMrl@cluster0.gicunyt.mongodb.net/iphotos?retryWrites=true&w=majority";


const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

module.exports = connectToMongo;
