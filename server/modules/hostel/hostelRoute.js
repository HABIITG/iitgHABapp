const express = require("express");
const {
  authenticateJWT,
  authenticateAdminJWT,
} = require("../../middleware/authenticateJWT.js");

const {
  createHostel,
  loginHostel,
  deleteHostel,
  getHostel,
  getHostelbyId,
  getAllHostels,
  applyMessChange,
  getAllHostelsWithMess,
  getAllHostelNameAndCaterer
} = require("./hostelController.js");

const hostelRouter = express.Router();
/**
 * @swagger
 * /api/hostel:
 *   post:
 *     summary: "Create a new hostel"
 *     tags: ["Hostel"]
 *     description: "Creates a new hostel and assigns it to a mess"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hostel_name
 *               - password
 *               - messId
 *             properties:
 *               hostel_name:
 *                 type: string
 *                 example: "Kameng Hostel"
 *               password:
 *                 type: string
 *                 example: "hostel123"
 *               messId:
 *                 type: string
 *                 example: "64a1b2c3d4e5f6789012347"
 *     responses:
 *       201:
 *         description: "Hostel created successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hostel created successfully"
 *                 hostel:
 *                   $ref: '#/components/schemas/Hostel'
 *       400:
 *         description: "Mess not found"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mess not found"
 *       500:
 *         description: "Server error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error occurred"
 */
hostelRouter.post("/", createHostel);

hostelRouter.post("/all/:hostelId",getHostelbyId);

/**
 * @swagger
 * /api/hostel/delete/{hostelId}:
 *   delete:
 *     summary: "Delete a hostel"
 *     tags: ["Hostel"]
 *     description: "Deletes a specific hostel by its ID"
 *     parameters:
 *       - name: hostelId
 *         in: path
 *         required: true
 *         description: "Unique identifier of the hostel to delete"
 *         schema:
 *           type: string
 *           example: "64a1b2c3d4e5f6789012346"
 *     responses:
 *       200:
 *         description: "Hostel deleted successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hostel deleted successfully"
 *       404:
 *         description: "Hostel not found"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hostel not found"
 *       500:
 *         description: "Internal server error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
hostelRouter.delete("/delete/:hostelId",deleteHostel);

/**
 * @swagger
 * /api/hostel/all/{hostelId}:
 *   get:
 *     summary: "Get hostel by ID"
 *     tags: ["Hostel"]
 *     description: "Retrieves a specific hostel by its ID with populated mess and user information"
 *     parameters:
 *       - name: hostelId
 *         in: path
 *         required: true
 *         description: "Unique identifier of the hostel"
 *         schema:
 *           type: string
 *           example: "64a1b2c3d4e5f6789012346"
 *     responses:
 *       200:
 *         description: "Hostel found successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hostel found"
 *                 hostel:
 *                   $ref: '#/components/schemas/Hostel'
 *       404:
 *         description: "Hostel not found"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hostel not found"
 *       500:
 *         description: "Server error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error occurred"
 */
hostelRouter.get("/all/:hostelId",getHostelbyId);

hostelRouter.post("/login", authenticateAdminJWT, loginHostel);

hostelRouter.get("/get", authenticateAdminJWT, getHostel);

/**
 * @swagger
 * /api/hostel/all:
 *   get:
 *     summary: "Get all hostels"
 *     tags: ["Hostel"]
 *     description: "Retrieves a list of all hostels in the system"
 *     responses:
 *       200:
 *         description: "Successfully retrieved all hostels"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hostel'
 *             example:
 *               - _id: "64a1b2c3d4e5f6789012346"
 *                 hostel_name: "Kameng Hostel"
 *                 users: []
 *                 messId: "64a1b2c3d4e5f6789012347"
 *                 curr_cap: 0
 *                 password: "$2b$10$N9qo8uLOickgx2ZMRZoMye..."
 *               - _id: "64a1b2c3d4e5f6789012348"
 *                 hostel_name: "Brahmaputra Hostel"
 *                 users: []
 *                 messId: "64a1b2c3d4e5f6789012349"
 *                 curr_cap: 25
 *                 password: "$2b$10$N9qo8uLOickgx2ZMRZoMye..."
 *       500:
 *         description: "Server error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error occurred"
 */
hostelRouter.get("/all", getAllHostels);

hostelRouter.get("/allhostel", getAllHostelsWithMess);

hostelRouter.post("/change", authenticateJWT, applyMessChange);

//Route to get only hostel and caterer information
hostelRouter.post("/gethnc",getAllHostelNameAndCaterer);
module.exports = hostelRouter;
