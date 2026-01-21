const express = require("express");

const {
  statsByDate,
  getTotalScanLogsCount,
  // createLogs,
  // deleteall
} = require("./ScanLogsController");

const scanLogsRouter = express.Router();

scanLogsRouter.get("/get/:date", statsByDate);
scanLogsRouter.get("/total", getTotalScanLogsCount);
// scanLogsRouter.post("/make", createLogs)
// scanLogsRouter.delete("/delete", deleteall)

module.exports = scanLogsRouter;
