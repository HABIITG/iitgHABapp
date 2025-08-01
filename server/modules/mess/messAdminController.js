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

const getMessMenuByDayForAdmin = async (req, res) => {
  try {
    const messId = req.params.messId;
    const day = req.body.day;
    if (!messId || !day) {
      return res.status(400).json({ message: "Mess ID and day are required" });
    }
    const allMenus = await Menu.find({});
    const menu = await Menu.find({messId:messId,day:day}); //FIX THIS! PUT MESS ID AS WELL
    if (!menu || menu.length === 0) {
      return res.status(200).json("DoesntExist");
    }

    const populatedMenus = [];

    for (let i = 0; i < menu.length; i++) {
      const menuObj = menu[i].toObject();
      const menuItems = menuObj.items;
      const menuItemDetails = await MenuItem.find({ _id: { $in: menuItems } });

      const updatedMenuItems = menuItemDetails.map((item) => {
        const itemObj = item.toObject();
        //itemObj.isLiked = item.likes.includes(userId);
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

//modify menu item
const modifyMenuItem = async (req, res) => {
  try {
    const _Id = req.body._Id;
    const name = req.body.name;
   // const hostelId = req.user.id; //use hostelID

    const menuItem = await MenuItem.findById(_Id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    menuItem.name = name || menuItem.name;
    
    await menuItem.save();

    return res
      .status(200)
      .json({ message: "Menu item updated successfully", menuItem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  modifyMenuItem, //to modify menu item
  getMessMenuByDayForAdmin
};
