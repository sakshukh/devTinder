const mongoose = require("mongoose");
console.log(process.env.MONGODB_CONNECT_URL);
const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_CONNECT_URL);
};

module.exports = { connectDB };
