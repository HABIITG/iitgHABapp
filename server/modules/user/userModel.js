const axios = require("axios");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET_KEY = process.env.JWT_SECRET;

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
