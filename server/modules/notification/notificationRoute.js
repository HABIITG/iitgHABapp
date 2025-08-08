const express = require("express");
const router = express.Router();
const {
  authenticateJWT,
  authenticateAdminJWT,
} = require("../../middleware/authenticateJWT.js");

const {
  registerToken,
  sendNotification,
  getUserNotifications,
  markAsRead,
} = require("./notificationController.js");

router.post("/send", authenticateAdminJWT, sendNotification);
router.post("/register-token", authenticateJWT, registerToken);
router.get("/", authenticateJWT, getUserNotifications);
router.post("/:id/mark-read", authenticateJWT, markAsRead);

module.exports = router;
