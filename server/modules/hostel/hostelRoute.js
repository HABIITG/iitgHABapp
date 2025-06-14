const express = require("express");
const {
  authenticateJWT,
  authenticateAdminJWT,
} = require("../../middleware/authenticateJWT.js");

const {
  createHostel,
  loginHostel,
  loginHostel,
  getHostel,
  getAllHostels,
  applyMessChange,
} = require("./hostelController.js");

const hostelRouter = express.Router();

hostelRouter.post("/", createHostel);

hostelRouter.post("/login", authenticateAdminJWT, loginHostel);

// hostelRouter.get('/:hostel_name', getHostel);

hostelRouter.get("/all", getAllHostels);

hostelRouter.post("/change", authenticateJWT, applyMessChange);

module.exports = hostelRouter;
