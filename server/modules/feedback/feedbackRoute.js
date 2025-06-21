// routes/feedbackRoutes.js

const express = require("express");
const feedbackRouter = express.Router();
const {
  submitFeedback,
  removeFeedback,
  downloadFeedbackSheet,
  removeAllFeedbacks,
} = require("./feedbackController");
const { authenticateJWT } = require("../../middleware/authenticateJWT");

// Route to generate and download the feedback report
feedbackRouter.post("/submit", submitFeedback);
feedbackRouter.post("/remove", removeFeedback);

// GET Excel file of all feedback for testing
//feedbackRouter.get('/download', downloadFeedbackSheet);

//feedbackRouter.delete('/removeAll', removeAllFeedbacks);

module.exports = feedbackRouter;
