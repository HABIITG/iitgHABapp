const express = require("express");

const complaintRouter = express.Router();

const { authenticateJWT } = require("../../middleware/authenticateJWT");

const {
  submitComplaint,
  updateComplaint,
  getComplaint,
  deleteComplaint,
} = require("./complaintController");

complaintRouter.post("/", authenticateJWT, submitComplaint);

complaintRouter.put("/:id", authenticateJWT, updateComplaint);

complaintRouter.get("/:id", authenticateJWT, getComplaint);

complaintRouter.delete("/:id", authenticateJWT, deleteComplaint);

module.exports = complaintRouter;
