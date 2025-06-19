const { ScanLogs } = require("./ScanLogsModel.js");

//For getting count of people who have eaten breakfast, lunch and dinner
const statsByDate = async (req, res) => {
  try {
    const date = req.params.date;
    const messid = req.body.messid;
    let logs = {};
    if(!messid){
      logs = await ScanLogs.find({date: date});
    }
    else{
      logs = await ScanLogs.find({date: date, messId: messid});
    }
    const stats = {total: 0, breakfast: 0, lunch: 0, dinner: 0};
    logs.forEach((item) => {
      if (item.breakfast) ++stats.breakfast;
      if (item.lunch) ++stats.lunch;
      if (item.dinner) ++stats.dinner;
      ++stats.total;
    })
    res.status(200).json(stats);
    console.log(logs);
    
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

//temporary function for creating sample logs
const createLogs = async(req, res) => {
  try {
    const logsdata = req.body;
    const insertedlogs = await ScanLogs.insertMany(logsdata);
    res.status(200).json({
      message: "Successfully inserted the data!",
      data: insertedlogs,
    })
  }
  catch (error){
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

//temporary function for deleting sample logs
const deleteall = async(req, res) => {
  try {
    await ScanLogs.deleteMany();
    res.status(200).json({
      message: "Successfulyy deleted everything!",
    })
  }
  catch (error){
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  statsByDate,
  createLogs,
  deleteall
}