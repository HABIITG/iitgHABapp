const express = require("express");
const router = express.Router();
const scope = "User.read offline_access Mail.read"; // Fixed the typo in 'offline_access'
const catchAsync = require("../../utils/catchAsync.js");
const {
    mobileRedirectHandler,
    loginHandler,
    logoutHandler,
} = require("./auth.controller.js");

// Not used
router.get("/login", loginHandler);

router.get("/login/redirect/mobile", mobileRedirectHandler);

router.get("/logout", logoutHandler);

// Exporting the router
module.exports = router;
