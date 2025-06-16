const express = require("express");
const { authenticateJWT } = require("../../middleware/authenticateJWT.js");

const {
  getUserData,
  createUser,
  deleteUser,
  updateUser,
  getUserComplaints,
  // getEmailsOfHABUsers,
  // getEmailsOfSecyUsers,
  getUserByRoll,
  getAllUsers,
} = require("./userController.js");

const userRouter = express.Router();

userRouter.post("/", createUser);
//
// userRouter.get('/roll/:roll', getUserByRoll);

userRouter.get("/", authenticateJWT, getUserData);

userRouter.delete("/:outlook", authenticateJWT, deleteUser);

userRouter.put("/:outlook", authenticateJWT, updateUser);

userRouter.get("/roll/:qr", getUserByRoll); //removed authenticateJWT from here

userRouter.get("/all", getAllUsers);

// userRouter.get('/complaints/:outlook', getUserComplaints);

// userRouter.get('/habmails', getEmailsOfHABUsers);

// userRouter.get('/welfaresecymails', getEmailsOfSecyUsers);

module.exports = userRouter;
