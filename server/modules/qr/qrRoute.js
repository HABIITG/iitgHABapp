const express = require("express");
const { authenticateJWT } = require("../../middleware/authenticateJWT.js");

const { createQR, checkScanned } = require("./qrController.js");

const qrRouter = express.Router();

qrRouter.put("/check", checkScanned);

qrRouter.post("/", createQR);

module.exports = qrRouter;
