const { authenticateJWT } = require("../../middleware/authenticateJWT.js");

const express = require("express");

const {
  getAllMessChangeRequests,
  getAllMessChangeRequestsForAllMess,
  acceptAndRejectByFCFS,
  acceptMessChangeRequest,
  rejectMessChangeRequest,
  messChangeRequest,
} = require("./messchangeController.js");

const messChangeRouter = express.Router();

messChangeRouter.get("/all", getAllMessChangeRequestsForAllMess);
messChangeRouter.post("/reqchange", authenticateJWT, messChangeRequest);
messChangeRouter.post("/accept-all/:hostelId", acceptAndRejectByFCFS); //accept all by first come first serve and reject rest
messChangeRouter.patch("/accept/:userId", acceptMessChangeRequest);
messChangeRouter.patch("/reject/:userId", rejectMessChangeRequest);
messChangeRouter.get("/:hostelId", getAllMessChangeRequests);

module.exports = messChangeRouter;
