const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Virat",
    lastName: "Kohali",
    emailId: "virat@kohali.com",
    age: 34,
    id: 123,
  };

  const user = new User(userObj);

  try {
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("Error saving user: ", err.message);
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
