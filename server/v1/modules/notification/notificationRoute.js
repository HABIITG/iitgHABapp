const express = require("express");
const router = express.Router();
const {
  authenticateJWT,
  authenticateAdminJWT,
} = require("../../middleware/authenticateJWT.js");

const {
  registerToken,
  sendNotification,
  sendWelcomeNotification,
} = require("./notificationController.js");

// Send notification requires admin authentication (hostel office or HAB)
router.post("/send", authenticateAdminJWT, sendNotification);
router.post("/register-token", authenticateJWT, registerToken);
// Send welcome notification - called from frontend after FCM token registration
router.post("/welcome", authenticateJWT, sendWelcomeNotification);

module.exports = router;
