// server/index.js
//import authRoutes from "./modules/auth/auth.routes.js";
const authRoutes = require("./modules/auth/auth.routes.js");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const itemRoute = require("./modules/item/itemRoute.js");
const userRoute = require("./modules/user/userRoute.js");
const cookieParser = require("cookie-parser");
const complaintRoute = require("./modules/complaint/complaintRoute.js");
const feedbackRoute = require("./modules/feedback/feedbackRoute.js");
const hostelRoute = require("./modules/hostel/hostelRoute.js");
const qrRoute = require("./modules/qr/qrRoute.js");
const messRoute = require("./modules/mess/messRoute.js");
const cors = require("cors");
const {
  wednesdayScheduler,
  sundayScheduler,
} = require("./modules/hostel/hostelScheduler.js");
const {
  feedbackScheduler,
} = require("./modules/feedback/feedbackScheduler.js");

const {
  feedbackResetScheduler,
} = require("./modules/feedback/feedbackScheduler.js");
require("dotenv").config();

const app = express();
const MONGOdb_uri = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend port
    credentials: true, // allow cookies
  })
);
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose
  .connect(MONGOdb_uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");

    wednesdayScheduler();

    sundayScheduler();

    feedbackScheduler();
    feedbackResetScheduler();
  })
  .catch((err) => console.log(err));

// Basic route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// hello route
app.get("/hello", (req, res) => {
  res.send("Hello from server");
});
// test route
//app.use('/api/test', testRoute);

// item route
app.use("/api/items", itemRoute);

// user route
app.use("/api/users", userRoute);

//complaint route
app.use("/api/complaints", complaintRoute);

//complaint route
app.use("/api/feedback", feedbackRoute);

//auth route
app.use("/api/auth", authRoutes);

//hostel route
app.use("/api/hostel", hostelRoute);

//qr route
app.use("/api/qr", qrRoute);

//mess route
app.use("/api/mess", messRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
