const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://sakshukh:7co08CAh9WSHI5TQ@devtinder.bjw43.mongodb.net/devTinder"
  );
};

module.exports = { connectDB };
