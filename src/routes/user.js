const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const router = express.Router();

const USER_SAFE_DATA =
  "firstName lastName age gender skills profileUrl hobbies";

router.get("/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Connection request received",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).json({ message: "Invalid request 😕" });
  }
});

router.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      status: "accepted",
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    if (connectionRequest.length < 1) {
      return res.json({
        message: "You don't have existing connections, please send new request",
      });
    }

    const data = connectionRequest.map((item) => {
      if (item.fromUserId._id.toString() == loggedInUser._id.toString()) {
        return item.toUserId;
      } else {
        return item.fromUserId;
      }
    });

    res.json({
      message:
        "here is the list of all your connections " + loggedInUser.firstName,
      data,
    });
  } catch (err) {
    res.status(400).json({
      message: `ERROR: ${err.message} ☹️`,
    });
  }
});

router.get("/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    limit = limit > 50 ? 50 : limit;

    console.log(page, limit);
    loggedInUser = req.user;

    // find connection request (send+received)
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
        },
        {
          fromUserId: loggedInUser._id,
        },
      ],
    }).select("fromUserId toUserId");

    const blockedUsersFromFeed = new Set();

    connectionRequest.forEach((req) => {
      blockedUsersFromFeed.add(req.fromUserId.toString());
      blockedUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(blockedUsersFromFeed) } },
        {
          _id: { $ne: loggedInUser._id },
        },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({
      message: "Success",
      users,
      length: users.length,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = router;
