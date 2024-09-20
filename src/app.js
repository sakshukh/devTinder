const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validate");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();

// parses incoming JSON payloads
app.use(express.json());
app.use(cookieParser());

// create a new instance of the User model
app.post("/signup", async (req, res) => {
  const {
    firstName,
    lastName,
    emailId,
    password,
    gender,
    age,
    profileUrl,
    skills,
  } = req.body;
  try {
    // validate the user data
    validateSignUpData(req);

    // encrypt password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      gender,
      age,
      profileUrl,
      skills,
    });

    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("Error saving user: " + err.message);
  }
});

// login API
app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.send("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJwt();
      // add the token and send back the cookie with token to the user
      res.cookie("token", token);
      res.send("Logged in successfully");
    } else {
      res.send("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("something went wrong" + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send("something went wrong" + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.send(user.firstName + " has sent a connection request!!");
  } catch (err) {
    res.status(400).send("Something went wrong!! " + err.message);
  }
});

// get the users profile from the database
app.get("/user", async (req, res) => {
  const email = req.body.email;
  try {
    const data = await User.findOne({ emailId: email });
    if (data) {
      res.send(data);
    }
    res.status(404).send("User not found");
  } catch (err) {
    res.status(400).send("something went wrong" + err.message);
  }
});

// get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

// delete a user from the database using id
app.delete("/user", async (req, res) => {
  try {
    const isDeleted = await User.findByIdAndDelete(req.body.userId);
    console.log(isDeleted);
    if (isDeleted) {
      res.send("User deleted successfully");
    } else {
      res.send("User not found");
    }
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

// updates the user data in the database
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  const ACCEPTED_PARAMS = ["skills", "profileUrl", "gender"];
  try {
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ACCEPTED_PARAMS.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Cannot update the provided fields");
    }
    await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("updated successfully");
  } catch (err) {
    res.status(400).send("Update Failed: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("DB connection established");
    app.listen(7777, () => {
      console.log("listening on port 7777");
    });
  })
  .catch((e) => console.log(e));
