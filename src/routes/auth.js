const express = require("express");
const { validateSignUpData } = require("../utils/validate");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

// create a new instance of the User model
router.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      emailId,
      password,
      gender,
      age,
      profileUrl,
      skills,
      about,
    } = req.body;
    // validate the user data
    validateSignUpData(req);

    // encrypt password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      gender,
      age,
      about,
      profileUrl,
      skills,
    });

    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// login API
router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.send("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJwt();
      // add the token and send back the cookie with token to the user
      res.cookie("token", token);
      return res.send(user.firstName + " has Logged in successfully 😊");
    } else {
      return res.send("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

router.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("Logged out successfully");
});

module.exports = router;
