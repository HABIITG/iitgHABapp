const mongoose = require("mongoose");

const messchangeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    
  },
  name: {
    type: String,
    
  },
  rollNumber: {
    type: String,
    unique : true,
    required : true
  },
  degree: {
    type: String,
    
  },
  hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      
    },
  sec_pref_mess: {
    type: String,
   
  },
    next_mess: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      default: function () {
        return this.hostel;
      },
    },
    got_mess_changed: {
    type: Boolean,
    default: false,
  },
  
});

const MessChange = mongoose.model("MessChange", messchangeSchema);

module.exports = { MessChange };
