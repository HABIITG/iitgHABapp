const { authenticateJWT } = require("../../middleware/authenticateJWT.js");

const express = require("express");

const {
  getAllMessChangeRequests,
  getAllMessChangeRequestsForAllMess,
  acceptMessChangeRequest,
  rejectMessChangeRequest,
  messChangeRequest,
} = require("./messchangeController.js");

const messChangeRouter = express.Router();

messChangeRouter.get("/all", getAllMessChangeRequestsForAllMess);
messChangeRouter.post("/reqchange", authenticateJWT, messChangeRequest);
messChangeRouter.patch("/accept/:userId", acceptMessChangeRequest);
messChangeRouter.patch("/reject/:userId", rejectMessChangeRequest);
messChangeRouter.get("/:hostelId", getAllMessChangeRequests);

module.exports = messChangeRouter;
