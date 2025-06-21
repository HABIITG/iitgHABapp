const express = require("express");
const {authenticateJWT} = require("../../middleware/authenticateJWT.js");
const {authenticateAdminJWT} = require("../../middleware/authenticateJWT.js");

const {
  createMess,
  createMessWithoutHostel,
  deleteMess,
  deleteMenu,
  createMenu,
  createMenuItem,
  deleteMenuItem,
  getUserMessInfo,
  getAllMessInfo,
  getMessInfo,
  getMessMenuByDay,
  getMessMenuByDayForAdminHAB,
  getMessMenuItemById,
  toggleLikeMenuItem,
  ScanMess,
  getUnassignedMess,
  assignMessToHostel,
  changeHostel,
  unassignMess
} = require("./messController");
const { getMessMenuByDayForAdmin, modifyMenuItem } = require("./messAdminController.js");

const messRouter = express.Router();

messRouter.post("/create", createMess);
messRouter.delete("/delete/:messId", deleteMess);
messRouter.post("/create-without-hostel", createMessWithoutHostel);
messRouter.post("/menu/create", createMenu);
messRouter.delete("/menu/delete/:menuId", deleteMenu);
messRouter.post("/menu/item/create", createMenuItem);
messRouter.delete("/menu/item/delete", deleteMenuItem);
messRouter.post("/get", authenticateJWT, getUserMessInfo);
messRouter.post("/all", getAllMessInfo);
messRouter.get("/:id", getMessInfo);
messRouter.post("/menu/:messId", authenticateJWT, getMessMenuByDay);
messRouter.post("/hab-menu/:messId", getMessMenuByDayForAdminHAB);
messRouter.post("/menu/:messId", authenticateJWT,getMessMenuByDay);
messRouter.post("/menu/item/:menuItemId", authenticateJWT, getMessMenuItemById);
messRouter.post(
  "/menu/item/like/:menuItemId",
  authenticateJWT,
  toggleLikeMenuItem
);
messRouter.post("/scan/:messId", authenticateJWT, ScanMess);
messRouter.post("/reassign/:messId", assignMessToHostel);
messRouter.post("/change-hostel/:messId", changeHostel);
messRouter.post("/unassigned", getUnassignedMess);
messRouter.post("/unassign/:messId", unassignMess);

//for admin
messRouter.post("/menu/admin/:messId", authenticateAdminJWT,getMessMenuByDayForAdmin);
messRouter.post("/menu/modify/:messId", authenticateAdminJWT,modifyMenuItem);
module.exports = messRouter;
