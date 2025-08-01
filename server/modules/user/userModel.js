const axios = require("axios");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET_KEY = process.env.JWT_SECRET;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - rollNumber
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the user
 *           example: "64a1b2c3d4e5f6789012345"
 *         name:
 *           type: string
 *           description: Full name of the user
 *           example: "John Doe"
 *         degree:
 *           type: string
 *           description: Academic degree program
 *           example: "B.Tech"
 *         rollNumber:
 *           type: string
 *           description: Unique roll number of the student
 *           example: "210101001"
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *           example: "john.doe@iitg.ac.in"
 *         year:
 *           type: number
 *           description: Current academic year
 *           example: 3
 *         hostel:
 *           type: string
 *           description: Reference to hostel ObjectId
 *           example: "64a1b2c3d4e5f6789012346"
 *         curr_subscribed_mess:
 *           type: string
 *           description: Currently subscribed mess (hostel reference)
 *           example: "64a1b2c3d4e5f6789012346"
 *         next_mess:
 *           type: string
 *           description: Next mess subscription (hostel reference)
 *           example: "64a1b2c3d4e5f6789012346"
 *         mess_change_button_pressed:
 *           type: boolean
 *           description: Whether mess change button has been pressed
 *           default: false
 *           example: false
 *         applied_hostel_string:
 *           type: string
 *           description: Applied hostel information
 *           default: ""
 *           example: "Kameng Hostel"
 *         applied_for_mess_changed:
 *           type: boolean
 *           description: Whether user has applied for mess change
 *           default: false
 *           example: false
 *         got_mess_changed:
 *           type: boolean
 *           description: Whether mess change was approved
 *           default: false
 *           example: false
 *         role:
 *           type: string
 *           enum: ["student", "hab", "welfare_secy", "gen_secy"]
 *           description: User role in the system
 *           default: "student"
 *           example: "student"
 *         complaints:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of complaint ObjectIds
 *           example: ["64a1b2c3d4e5f6789012347", "64a1b2c3d4e5f6789012348"]
 *         phoneNumber:
 *           type: string
 *           description: Contact phone number
 *           example: "+91 9876543210"
 *         roomNumber:
 *           type: string
 *           description: Room number in hostel
 *           example: "A-101"
 *         feedbackSubmitted:
 *           type: boolean
 *           description: Whether user has submitted feedback
 *           default: false
 *           example: false
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
  },
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
  },
  curr_subscribed_mess: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
    default: function () {
      return this.hostel;
    },
  },
  next_mess: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
    default: function () {
      return this.hostel;
    },
  },

  mess_change_button_pressed: {
    type: Boolean,
    default: false,
  },

  applied_hostel_string: {
    type: String,
    default: "",
  },

  applied_for_mess_changed: {
    type: Boolean,
    default: false,
  },

  got_mess_changed: {
    type: Boolean,
    default: false,
  },

  role: {
    type: String,
    enum: ["student", "hab", "welfare_secy", "gen_secy"],
    default: "student",
    // here it was required true
  },
  complaints: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
    },
  ],
  phoneNumber: {
    type: String,
  },
  roomNumber: {
    type: String,
  },
  feedbackSubmitted: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateJWT = function () {
  var user = this;
  var token = jwt.sign({ user: user._id }, JWT_SECRET_KEY, {
    expiresIn: "24d",
  });
  return token;
};

userSchema.statics.findByJWT = async function (token) {
  try {
    var user = this;
    var decoded = jwt.verify(token, JWT_SECRET_KEY);
    const id = decoded.user;
    const fetchedUser = await user.findOne({ _id: id });
    if (!fetchedUser) return false;
    return fetchedUser;
  } catch (error) {
    return false;
  }
};

const User = mongoose.model("User", userSchema);

const getUserFromToken = async function (access_token) {
  try {
    var config = {
      method: "get",
      url: "https://graph.microsoft.com/v1.0/me",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };
    const response = await axios.get(config.url, {
      headers: config.headers,
    });
    //console.log(response);

    return response;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const findUserWithEmail = async function (email) {
  const user = await User.findOne({ email: email });
  // console.log("found user with email", user);
  if (!user) return false;
  return user;
};

module.exports = {
  getUserFromToken,
  User,
  findUserWithEmail,
};
