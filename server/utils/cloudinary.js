const cloudinary = require("cloudinary").v2
require("dotenv").config();
cloudinary.config();
module.exports = cloudinary;