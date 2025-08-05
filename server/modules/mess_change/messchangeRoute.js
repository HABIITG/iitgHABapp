const express = require("express");

const {
  getAllMessChangeRequests,
  getAllMessChangeRequestsForAllMess,
  acceptMessChangeRequest,
  rejectMessChangeRequest,
  messChangeRequest
} = require("./messchangeController.js");

const messChangeRouter = express.Router();


messChangeRouter.get("/all",getAllMessChangeRequestsForAllMess );
messChangeRouter.post("/reqchange", messChangeRequest);
messChangeRouter.patch("/accept",acceptMessChangeRequest );
messChangeRouter.patch("/reject", rejectMessChangeRequest);
messChangeRouter.get("/:hostelId",getAllMessChangeRequests );


module.exports = messChangeRouter;