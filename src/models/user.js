const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      requires: true,
      minLength: 3,
      maxLength: 20,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    emailId: {
      type: String,
      required: true,
      immutable: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Invalid password");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Invalid gender");
        }
      },
    },
    profileUrl: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.com%2Fen%2Fsearch%3Fq%3Ddefault&psig=AOvVaw0ed6z7v4BdWz9mJGikK0D1&ust=1726748986843000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLiuh7S_zIgDFQAAAAAdAAAAABAE",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL");
        }
      },
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 15) {
          throw new Error("Skills are invalid");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJwt = async function () {
  const token = await jwt.sign({ _id: this._id }, "Dev@Tinder43!", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    this.password
  );
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

// phone number
// DOB
// relationship intent
// location access
