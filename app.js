const express = require("express");
const { connectDB } = require("./src/config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./src/routes/auth");
const profileRoute = require("./src/routes/profile");
const requestRoute = require("./src/routes/request");
const userRoute = require("./src/routes/user");
require("dotenv").config();

const app = express();

// parses incoming JSON payloads
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/profile", profileRoute);
app.use("/request", requestRoute);
app.use("/user", userRoute);

connectDB()
  .then(() => {
    console.log("DB connection established");
    app.listen(process.env.PORT, () => {
      console.log("listening on port http://localhost:" + process.env.PORT);
    });
  })
  .catch((e) => console.log(e));
