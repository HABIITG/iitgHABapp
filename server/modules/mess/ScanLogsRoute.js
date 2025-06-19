const express = require("express")

const {
    statsByDate,
    createLogs,
    deleteall
} = require("./ScanLogsController")

const scanLogsRouter = express.Router();

scanLogsRouter.get("/get/:date", statsByDate)
scanLogsRouter.post("/make", createLogs)
scanLogsRouter.delete("/delete", deleteall)

module.exports = scanLogsRouter