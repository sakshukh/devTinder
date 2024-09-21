const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateSendRequest } = require("../utils/validate");

const router = express.Router();

router.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const { status, toUserId } = req.params;
    const fromUserId = req.user._id;
    validateSendRequest(req, status, toUserId);

    const doesToUserExist = await User.findById(toUserId);

    if (!doesToUserExist) {
      return res.status(404).send({
        message: `${toUserId} does not exist`,
      });
    }

    const connectionRequestExist = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (connectionRequestExist) {
      return res.status(400).json({
        message: "Connection request already exists",
      });
    }

    const newConnectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    await newConnectionRequest.save();

    res.json({
      message: "Connection request sent successfully",
      newConnectionRequest,
    });
  } catch (err) {
    res.status(400).send("ERROR:  " + err.message);
  }
});

router.post("/review/:status/:reviewId", userAuth, async (req, res) => {
  try {
    const { status, reviewId } = req.params;
    const loggedInUser = req.user;

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(403).json({ message: "Invalid status " + status });
    }

    const data = await ConnectionRequest.findOne({
      _id: reviewId,
      toUserId: loggedInUser,
      status: "interested",
    });

    if (!data) {
      return res.status(400).json({
        message: "Invalid Connection Request",
      });
    }

    data.status = status;
    await data.save();

    res.json({
      message: `Connection Request ${status}`,
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = router;
