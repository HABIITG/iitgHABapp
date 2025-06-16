//const axios =require("axios");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { adminjwtsecret } = require("../../config/default.js");

dotenv.config();
// Added comment 32

const userTimeStampSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // timestamp: {
  //     type: Date,
  //     default: Date.now
  // },
  reason_for_change: {
    type: String,
    default: "",
  },
});

const hostelSchema = new mongoose.Schema({
  hostel_name: {
    type: String,
    required: true,
    unique: true,
  },
  users: {
    type: [userTimeStampSchema],
    default: [],
  },
  messId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mess",
  },
  curr_cap: {
    type: Number,
    default: 0,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

hostelSchema.pre("save", async function (next) {
  // Hash password before saving
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

hostelSchema.methods.verifyPassword = function (givenPassword) {
  return bcrypt.compare(givenPassword, this.password);
};

hostelSchema.methods.generateJWT = function () {
  let hostel = this;
  let token = jwt.sign({ hostel: hostel._id }, adminjwtsecret, {
    expiresIn: "2h",
  });
  return token;
};

hostelSchema.statics.findByJWT = async function (token) {
  try {
    let hostel = this;
    var decoded = jwt.verify(token, adminjwtsecret);
    const id = decoded.hostel;
    const fetchedHostel = await hostel.findOne({ _id: id });
    if (!fetchedHostel) return false;
    return fetchedHostel;
  } catch (error) {
    return false;
  }
};

const Hostel = mongoose.model("Hostel", hostelSchema);

module.exports = { Hostel };
