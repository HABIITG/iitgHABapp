// const loginValidation = require("../Middlewares/AuthValidation");
// const login = require("../Middlewares/AuthValidation");
const router = require("express").Router();
const { createAdmin, loginAdmin } = require("./adminController");
const adminAuth = require("../../middleware/adminMiddleware");

// Create admin
router.post("/create-admin", createAdmin);

// Admin login
router.post("/login", loginAdmin);

router.get("/dashboard", adminAuth, (req, res) => {
  res.status(200).json({ message: `Welcome Admin ${req.admin.username}` });
});

module.exports = router;
