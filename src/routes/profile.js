const { userAuth } = require("../middlewares/auth");
const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const {
  validateProfileEditData,
  validatePasswordChangeData,
} = require("../utils/validate");

const router = express.Router();

router.get("/view", userAuth, async (req, res) => {
  try {
    res.json({ message: "success", data: req.user });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

router.patch("/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      return res
        .status(400)
        .json({ message: "error in saving provided data", data: req.body });
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    res.json({ message: "success", data: loggedInUser });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

router.patch("/change/password", userAuth, async (req, res) => {
  try {
    validatePasswordChangeData(req);
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    const isCorrectPassword = await user.validatePassword(currentPassword);
    if (!isCorrectPassword) {
      throw new Error("Invalid Credentials");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    await user.save();

    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .json({
        message: "password updated successfully",
      });
  } catch (e) {
    res.status(400).send("ERROR: " + e.message);
  }
});

router.post("/forget/password", (req, res) => {
  // will send a token with some expirey time on registerd email
  // click on token
  // open a page on browser
  // change password
});

router.delete("/delete", userAuth, async (req, res) => {});

module.exports = router;
