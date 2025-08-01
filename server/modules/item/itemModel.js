const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  qrCode: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },
  location: {
    type: String,
  },
  status: {
    type: String,
    enum: ["unresolved", "resolved", "in_progress"],
  },
  complainUpdate: {
    type: String,
  },
  complaints: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
    },
  ],
  currentAuthority: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'User'
    type: String,
    enum: ["hab", "secy"],
    default: "secy",
  },
  hostel: {
    type: String,
  },
  comment: {
    type: String,
  },
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
