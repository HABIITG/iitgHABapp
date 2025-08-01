const getCurrentDate = () => {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // YYYY-MM-DD
};

const getCurrentTime = () => {
  return new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  }); // HH:mm
};

const getCurrentDay = () => {
  return new Date().toLocaleString("en-US", {
    weekday: "long",
    timeZone: "Asia/Kolkata",
  });
};

module.exports = {
  getCurrentDate,
  getCurrentTime,
  getCurrentDay,
};
