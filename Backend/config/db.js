const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://cheenuborkar:61K9DBkqzu9oTkBg@cluster0.s1c56ru.mongodb.net/"
    );
    console.log(
      `Connected To MongoDB Database ${mongoose.connection.host}`.bgMagenta
        .white
    );
  } catch (error) {
    console.log(`MongoDB Error: ${error}`.bgRed.white);
  }
};

module.exports = { connectDB };
