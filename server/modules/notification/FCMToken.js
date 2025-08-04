const mongoose = require("mongoose");

const fcmTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    token: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FCMToken", fcmTokenSchema);
