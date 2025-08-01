const express = require('express');
const {authenticateJWT} = require('../../middleware/authenticateJWT.js');

const {
  getComplaintsOfItemsByHostel,
  createItem,
  deleteItem,
  updateItem,
  getItems,
  getItem,
  getItemsWithComplaints,
  getItemsForHAB,
  resolveItem,
  inProgressItem,
} = require("./itemController");

const itemRouter = express.Router();

itemRouter.get(
  "/complaints/:hostel",
  authenticateJWT,
  getComplaintsOfItemsByHostel
);

itemRouter.post("/", authenticateJWT, createItem);

itemRouter.delete("/:id", authenticateJWT, deleteItem);

itemRouter.put("/:id", authenticateJWT, updateItem);

itemRouter.get("/", authenticateJWT, getItems);

// itemRouter.get('/:qr', getItem);

// itemRouter.get('/hostelcomplaints/:hostel', getItemsWithComplaints);

// itemRouter.get('/hab/:hostel', getItemsForHAB);

// itemRouter.get('/resolve/:itemId', resolveItem);

// itemRouter.get('/inprogress/:itemId', inProgressItem);

module.exports = itemRouter;
