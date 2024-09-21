const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function userAuth(req, res, next) {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token!!");
    }
    const decoded = await jwt.verify(token, "Dev@Tinder43!");
    // decoded = { _id: '66eaf88769eab963457a8a3d', iat: 1726811117, exp: 1726814717 }
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error("User not found!!");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send(err.message);
  }
}

module.exports = {
  userAuth,
};
