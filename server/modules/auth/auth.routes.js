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

/**
 * @swagger
 * /api/auth/login/redirect/mobile:
 *   get:
 *     summary: "Mobile OAuth redirect handler"
 *     tags: ["Authentication"]
 *     description: |
 *       **Internal OAuth callback endpoint - DO NOT call this directly.**
 * 
 *       This endpoint is used to handle the OAuth redirect after successful authentication.
 *       It processes the authorization code received from the OAuth provider and exchanges it for an access token.
 *     parameters:
 *       - name: code
 *         in: query
 *         required: true
 *         description: "Authorization code received from the OAuth provider"
 *         schema:
 *           type: string
 *           example: "0.ABC123XYZ456...."
 *       - name:  state
 *         in: query
 *         required: false
 *         description: "State parameter to maintain state between request and callback"
 *         schema:
 *           type: string
 *           example: "user.read"
 *     responses:
 *       302:
*          description: "Redirects to the mobile app with the access token"
*          headers:
*            Location:
*              description: "Redirect URL to the mobile app with the access token and user data"
*              schema:
*                type: string
*                example: "iitgcomplain://success?token=JWT_TOKEN&user=USER_DATA"
 *       400:
 *         description: Bad Request - Authorization code missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Authorization code is missing"
 *       401:
 *         description: Unauthorized - Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access denied."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 */
router.get("/login/redirect/mobile", mobileRedirectHandler);

router.get("/logout", logoutHandler);

// Exporting the router
module.exports = router;
