const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  emailId: String,
  password: String,
  age: Number,
  gender: String,
  date: {
    type: Date,
    default: new Date(),
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
