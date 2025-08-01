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

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: "Create a new user"
 *     tags: ["User"]
 *     description: "Creates a new user in the system and returns JWT token"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - rollNumber
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               rollNumber:
 *                 type: string
 *                 example: "210101001"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@iitg.ac.in"
 *               degree:
 *                 type: string
 *                 example: "B.Tech"
 *               year:
 *                 type: number
 *                 example: 3
 *               phoneNumber:
 *                 type: string
 *                 example: "+91 9876543210"
 *               roomNumber:
 *                 type: string
 *                 example: "A-101"
 *     responses:
 *       201:
 *         description: "User created successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *                 token:
 *                   type: string
 *                   description: "JWT token for authentication"
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: "User already exists"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User already exists"
 *       500:
 *         description: "Server error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error creating user"
 *                 error:
 *                   type: object
 *                   description: "Error details"
 */
userRouter.post("/", createUser);
//
// userRouter.get('/roll/:roll', getUserByRoll);

userRouter.get("/", authenticateJWT, getUserData);

userRouter.delete("/:outlook", authenticateJWT, deleteUser);

userRouter.put("/:outlook", authenticateJWT, updateUser);

userRouter.get("/roll/:qr", getUserByRoll); //removed authenticateJWT from here

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: "Get all users"
 *     tags: ["User"]
 *     description: "Retrieves a list of all users with their subscribed mess names"
 *     responses:
 *       200:
 *         description: "Successfully retrieved all users"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/User'
 *                   - type: object
 *                     properties:
 *                       curr_subscribed_mess_name:
 *                         type: string
 *                         description: "Name of the currently subscribed mess/hostel"
 *                         example: "Kameng Hostel"
 *                         nullable: true
 *             example:
 *               - _id: "64a1b2c3d4e5f6789012345"
 *                 name: "John Doe"
 *                 rollNumber: "210101001"
 *                 email: "john.doe@iitg.ac.in"
 *                 degree: "B.Tech"
 *                 year: 3
 *                 curr_subscribed_mess: "64a1b2c3d4e5f6789012346"
 *                 curr_subscribed_mess_name: "Kameng Hostel"
 *                 role: "student"
 *                 complaints: []
 *                 feedbackSubmitted: false
 *               - _id: "64a1b2c3d4e5f6789012348"
 *                 name: "Jane Smith"
 *                 rollNumber: "210101002"
 *                 email: "jane.smith@iitg.ac.in"
 *                 degree: "M.Tech"
 *                 year: 1
 *                 curr_subscribed_mess: null
 *                 curr_subscribed_mess_name: null
 *                 role: "student"
 *                 complaints: []
 *                 feedbackSubmitted: false
 *       500:
 *         description: "Server error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching users"
 */
userRouter.get("/all", getAllUsers);

// userRouter.get('/complaints/:outlook', getUserComplaints);

// userRouter.get('/habmails', getEmailsOfHABUsers);

// userRouter.get('/welfaresecymails', getEmailsOfSecyUsers);

module.exports = userRouter;
