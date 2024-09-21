const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRoute = require("./routes/profile");
const requestRoute = require("./routes/request");

const app = express();

// parses incoming JSON payloads
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/profile", profileRoute);
app.use("/request", requestRoute);

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
