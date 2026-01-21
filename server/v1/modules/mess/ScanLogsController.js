const { ScanLogs } = require("./ScanLogsModel.js");

//For getting count of people who have eaten breakfast, lunch and dinner
const statsByDate = async (req, res) => {
  try {
    const date = req.params.date;
    const messid = req.query.messId;
    let logs = {};
    if (!messid) {
      logs = await ScanLogs.find({ date: date });
    }
    else {
      logs = await ScanLogs.find({ date: date, messId: messid });
    }
    const stats = { total: 0, breakfast: 0, lunch: 0, dinner: 0, highest: ["",0], lowest: ["",0] };

    //For finding highest and lowest attendance mess
    const messwisestats = {};

    logs.forEach((item) => {
      if(!(item.messId in messwisestats)) messwisestats[item.messId] = [0,0];
      if (item.breakfast){
        ++messwisestats[item.messId][0];
        ++stats.breakfast;
      } 
      if (item.lunch){
        ++messwisestats[item.messId][0];
        ++stats.lunch;
      } 
      if (item.dinner){
        ++messwisestats[item.messId][0];
        ++stats.dinner;
      } 
      ++stats.total;
      ++messwisestats[item.messId][1]
    })

    //looping through the messes to find highest and lowest
    for(const key in messwisestats){
      const attendance = (messwisestats[key][0]/messwisestats[key][1]/3*100).toFixed(1);
      if (!stats.highest[0]){
        stats.lowest[0] = key; stats.lowest[1] = attendance
        stats.highest[0] = key; stats.highest[1] = attendance
      }
      else if (attendance > stats.highest[1]){
        stats.highest[0] = key;
        stats.highest[1] = attendance
      }
      else if (attendance < stats.lowest[1]){
        stats.lowest[0] = key;
        stats.lowest[1] = attendance;
      }
    }
console.log(stats)
    res.status(200).json(stats);
  }
  catch (error) {
    console.error(error);
    console.log("hello")
    return res.status(500).json({ message: "Internal server error" });
  }
}

//temporary function for creating sample logs
const createLogs = async (req, res) => {
  try {
    const logsdata = req.body;
    const insertedlogs = await ScanLogs.insertMany(logsdata);
    res.status(200).json({
      message: "Successfully inserted the data!",
      data: insertedlogs,
    })
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

//temporary function for deleting sample logs
const deleteall = async (req, res) => {
  try {
    await ScanLogs.deleteMany();
    res.status(200).json({
      message: "Successfulyy deleted everything!",
    })
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get total count of all scan logs
const getTotalScanLogsCount = async (req, res) => {
  try {
    const totalCount = await ScanLogs.countDocuments({});
    res.status(200).json({ total: totalCount });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  statsByDate,
  createLogs,
  deleteall,
  getTotalScanLogsCount
}