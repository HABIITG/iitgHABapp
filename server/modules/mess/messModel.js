const mongoose = require("mongoose");

const messSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
    //required: true,
  },
  complaints: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
    },
  ],
  rating: {
    type: Number,
    default: 0,
  },
  ranking: {
    type: Number,
    default: 0,
  },

  qrCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QR",
  },
});

const Mess = mongoose.model("Mess", messSchema);

module.exports = { Mess };
