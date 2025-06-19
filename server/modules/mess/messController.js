const { Mess } = require("./messModel");
const { Menu } = require("./menuModel");
const { MenuItem } = require("./menuItemModel");
const { User } = require("../user/userModel");
const { Hostel } = require("../hostel/hostelModel");
const { ScanLogs } = require("./ScanLogsModel.js");
const mongoose = require("mongoose");

const {
  getCurrentDate,
  getCurrentTime,
  getCurrentDay,
} = require("../../utils/date.js");

const createMess = async (req, res) => {
  try {
    const { name, hostelId } = req.body;

    const newMess = new Mess({
      name,
      hostelId,
    });
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }
    await newMess.save();
    hostel.messId = newMess._id;
    await hostel.save();
    return res.status(201).json(newMess);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const createMenu = async (req, res) => {
  try {
    const { messId, day, startTime, endTime, isGala, type } = req.body;

    const newMenu = new Menu({
      messId,
      day,
      startTime,
      endTime,
      isGala,
      type,
    });

    await newMenu.save();
    return res.status(201).json(newMenu);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const { menuId, name, type } = req.body;

    const newMenuItem = new MenuItem({
      menuId,
      name,
      type,
    });

    await newMenuItem.save();
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }
    menu.items.push(newMenuItem._id);
    await menu.save();
    return res.status(201).json(newMenuItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const menuItemId = req.params.menuItemId;

    const deletedMenuItem = await MenuItem.findByIdAndDelete(menuItemId);
    if (!deletedMenuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    const menu = await Menu.findById(deletedMenuItem.menuId);
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }
    menu.items = menu.items.filter((item) => item.toString() !== menuItemId);
    await menu.save();

    return res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUserMessInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const messHostelId = user.curr_subscribed_mess;
    const messHostel = await Hostel.findById(messHostelId);
    const messId = messHostel.messId;
    const messInfo = await Mess.findById(messId);
    if (!messInfo) {
      return res.status(404).json({ message: "Mess not found" });
    }
    return res.status(200).json(messInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllMessInfo = async (req, res) => {
  try {
    const messes = await Mess.find();

    if (!messes || messes.length === 0) {
      return res.status(404).json({ message: "No mess found" });
    }

    const messesWithHostelName = await Promise.all(
      messes.map(async (mess) => {
        const messObj = mess.toObject();
        const hostel = await Hostel.findById(messObj.hostelId);
        messObj.hostelName = hostel ? hostel.hostel_name : "Unknown";
        console.log(messObj.hostelName);
        return messObj;
      })
    );

    return res.status(200).json(messesWithHostelName);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getMessMenuByDay = async (req, res) => {
  try {
    const messId = req.params.messId;
    const day = req.body.day;
    const userId = req.user.id;

    if (!messId || !day) {
      return res.status(400).json({ message: "Mess ID and day are required" });
    }

    const menu = await Menu.find({ messId, day });
    if (!menu || menu.length === 0) {
      return res.status(404).json({ message: "Menu not found" });
    }

    const populatedMenus = [];

    for (let i = 0; i < menu.length; i++) {
      const menuObj = menu[i].toObject();
      const menuItems = menuObj.items;
      const menuItemDetails = await MenuItem.find({ _id: { $in: menuItems } });

      const updatedMenuItems = menuItemDetails.map((item) => {
        const itemObj = item.toObject();
        itemObj.isLiked = item.likes.includes(userId);
        return itemObj;
      });

      menuObj.items = updatedMenuItems;
      populatedMenus.push(menuObj);
    }

    return res.status(200).json(populatedMenus);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getMessMenuItemById = async (req, res) => {
  try {
    const menuItemId = req.params.menuItemId;
    const menuItemDoc = await MenuItem.findById(menuItemId);
    const userId = req.user.id;

    if (!menuItemDoc) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const menuItem = menuItemDoc.toObject(); // Convert to plain object
    menuItem.isLiked = menuItem.likes.includes(userId);

    return res.status(200).json(menuItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const toggleLikeMenuItem = async (req, res) => {
  try {
    const menuItemId = req.params.menuItemId;
    const userId = req.user.id;

    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    if (menuItem.likes.includes(userId)) {
      menuItem.likes = menuItem.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      await menuItem.save();
      return res
        .status(200)
        .json({ message: "Menu item unliked successfully" });
    } else {
      menuItem.likes.push(userId);
      await menuItem.save();
      return res.status(200).json({ message: "Menu item liked successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// const ScanMess = async (req, res) => {
//   try {
//     const messId = req.params.messId;
//     const messInfo = await Mess.findById(messId);
//     const userId = req.user.id;
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     if (!messInfo) {
//       return res.status(404).json({ message: "Mess not found" });
//     }
//     if (messInfo.hostelId !== user.curr_subscribed_mess) {
//       return res
//         .status(400)
//         .json({ message: "User is not subscribed to this mess" });
//     }
//     if (
//       ScanLogs.find({ userId: userId, messId: messId, date: getCurrentDate() })
//     ) {
//       const time = getCurrentTime();
//       const breakfast = Menu.find({
//         messId: messId,
//         day: getCurrentDay(),
//         type: "Breakfast",
//       });
//       if (time >= breakfast.startTime && time <= breakfast.endTime) {
//         if (!ScanLogs.breakfast) {
//           ScanLogs.breakfast = true;
//           return res.status(200).json({ message: "Breakfast" });
//         } else {
//           return res
//             .status(400)
//             .json({ message: "Already scanned for breakfast" });
//         }
//       }
//       const lunch = Menu.find({
//         messId: messId,
//         day: getCurrentDay(),
//         type: "Lunch",
//       });
//       if (time >= lunch.startTime && time <= lunch.endTime) {
//         if (!ScanLogs.lunch) {
//           ScanLogs.lunch = true;
//           return res.status(200).json({ message: "Lunch" });
//         } else {
//           return res.status(400).json({ message: "Already scanned for lunch" });
//         }
//       }
//       const dinner = Menu.find({
//         messId: messId,
//         day: getCurrentDay(),
//         type: "Dinner",
//       });
//       if (time >= dinner.startTime && time <= dinner.endTime) {
//         if (!ScanLogs.dinner) {
//           ScanLogs.dinner = true;
//           return res.status(200).json({ message: "Dinner" });
//         } else {
//           return res
//             .status(400)
//             .json({ message: "Already scanned for dinner" });
//         }
//       }
//       return res
//         .status(400)
//         .json({ message: "No meals available at this time" });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

const ScanMess = async (req, res) => {
  try {
    console.log("happending");

    const messId = req.params.messId;
    const { userId } = req.body;
    console.log(userId);
    console.log(messId);
    // Find mess and user
    const messInfo = await Mess.findById(mongoose.Types.ObjectId(messId));
    const user = await User.findById(userId);


    if (!user) {
      console.error("User not found");
      return res.status(404).json({
        message: "User not found",
        success: false,
        success: false,
      });
    }

    if (!messInfo) {
      console.error("Mess not found");
      return res.status(404).json({
        message: "Mess not found",
        success: false,
        success: false,
      });
    }

    console.log(messInfo.hostelId, user.curr_subscribed_mess);

    console.log(messInfo.hostelId, user.curr_subscribed_mess);
    // Check if user is subscribed to this mess
    if (toString(messInfo.hostelId) !== toString(user.curr_subscribed_mess)) {
      return res.status(400).json({
      return res.status(400).json({
        message: "User is not subscribed to this mess",
        success: false,
        success: false,
      });
    }


    const currentDate = getCurrentDate();
    const currentTime = getCurrentTime();
    const currentDay = getCurrentDay();


    // Find existing scan log for today
    let scanLog = await ScanLogs.findOne({
      userId: userId,
      messId: messId,
      date: currentDate,
    let scanLog = await ScanLogs.findOne({
      userId: userId,
      messId: messId,
      date: currentDate,
    });


    // If no scan log exists for today, create one
    if (!scanLog) {
      scanLog = new ScanLogs({
        userId: userId,
        messId: messId,
        date: currentDate,
        breakfast: false,
        lunch: false,
        dinner: false,
        dinner: false,
      });
    }


    // Check meal timings and availability
    const breakfast = await Menu.findOne({
      messId: messId,
      day: currentDay,
      type: "Breakfast",
    });


    const lunch = await Menu.findOne({
      messId: messId,
      day: currentDay,
      type: "Lunch",
    });


    const dinner = await Menu.findOne({
      messId: messId,
      day: currentDay,
      type: "Dinner",
    });


    let mealType = null;
    let alreadyScanned = false;


    // Check breakfast timing
    if (
      breakfast &&
      currentTime >= breakfast.startTime &&
      currentTime <= breakfast.endTime
    ) {
    if (
      breakfast &&
      currentTime >= breakfast.startTime &&
      currentTime <= breakfast.endTime
    ) {
      if (!scanLog.breakfast) {
        scanLog.breakfast = true;
        mealType = "Breakfast";
      } else {
        alreadyScanned = true;
        mealType = "Breakfast";
      }
    }
    // Check lunch timing
    else if (lunch && currentTime >= lunch.startTime) {
    else if (lunch && currentTime >= lunch.startTime) {
      if (!scanLog.lunch) {
        scanLog.lunch = true;
        mealType = "Lunch";
      } else {
        alreadyScanned = true;
        mealType = "Lunch";
      }
    }
    // Check dinner timing
    else if (
      dinner &&
      currentTime >= dinner.startTime &&
      currentTime <= dinner.endTime
    ) {
    else if (
      dinner &&
      currentTime >= dinner.startTime &&
      currentTime <= dinner.endTime
    ) {
      if (!scanLog.dinner) {
        scanLog.dinner = true;
        mealType = "Dinner";
      } else {
        alreadyScanned = true;
        mealType = "Dinner";
      }
    }


    // If already scanned for current meal
    if (alreadyScanned) {
      return res.status(200).json({
      return res.status(200).json({
        message: `Already scanned for ${mealType.toLowerCase()}`,
        success: false,
        mealType: mealType,
        time: formatTime(currentTime),
        date: formatDate(currentDate),
        date: formatDate(currentDate),
      });
    }


    // If no meal is available at current time
    if (!mealType) {
      return res.status(400).json({
      return res.status(400).json({
        message: "No meals available at this time",
        success: false,
        time: formatTime(currentTime),
        date: formatDate(currentDate),
        date: formatDate(currentDate),
      });
    }


    // Save the scan log
    await scanLog.save();


    // Return success response with user details
    return res.status(200).json({
    return res.status(200).json({
      message: "Scan successful",
      success: true,
      mealType: mealType,
      time: formatTime(currentTime),
      date: formatDate(currentDate),
      user: {
        name: user.name,
        rollNumber: user.rollNumber,
        // Hardcoded image for now as requested
        photo:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        photo:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        hostel: user.hostel,
        year: user.year,
        degree: user.degree,
      },
        degree: user.degree,
      },
    });
  } catch (error) {
    console.error("Error in ScanMess:", error);
    return res.status(500).json({
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
      error: error.message,
    });
  }
};

const formatTime = (time) => {
  const [hours, minutes] = time.split(":");
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${period}`;
};

const formatDate = (date) => {
  const dateObj = new Date(date);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${dateObj.getDate()} ${
    months[dateObj.getMonth()]
  } ${dateObj.getFullYear()}`;
  return `${dateObj.getDate()} ${
    months[dateObj.getMonth()]
  } ${dateObj.getFullYear()}`;
};

module.exports = {
  createMess,
  createMenu,
  createMenuItem,
  deleteMenuItem,
  getUserMessInfo,
  getAllMessInfo,
  getMessMenuByDay,
  getMessMenuItemById,
  toggleLikeMenuItem,
  ScanMess,
};
