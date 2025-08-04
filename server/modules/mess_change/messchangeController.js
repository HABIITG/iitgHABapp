const { Hostel } = require("../hostel/hostelModel.js");
const { Mess } = require("../mess/messModel.js");
const { User } = require("../user/userModel.js");
const { MessChange } = require("./messchangeModel.js");


const getAllMessChangeRequests = async (req, res) => {
  const { hostelId } = req.params;

  try {
    const messChangeRequests = await MessChange.find({ hostelId })
      .populate("hostelId", "name")  
      // .populate("next_mess", "next_mess");  

    if (!messChangeRequests || messChangeRequests.length === 0) {
      return res.status(404).json({ message: "No mess change requests found for this hostel" });
    }

    return res.status(200).json({
      message: "Mess change requests fetched successfully",
      data: messChangeRequests,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const getAllMessChangeRequestsForAllMess = async (req, res) => {
  try {
    
    const messChanges = await MessChange.find()
     return res.status(200).json(messChanges);
   
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const acceptMessChangeRequest = async (req, res) => {
  try {
     const { userId } = req.body;
    
// console.log(userId);

const user = await User.findById( userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const messChange = await MessChange.findOne({rollNumber : user.rollNumber});
    // console.log(messChange);

    //Update user's mess details
    user.curr_subscribed_mess = user.next_mess;
    user.applied_for_mess_changed = false;
    user.got_mess_changed = true;
    user.mess_change_button_pressed = false;
    await user.save();
    
    // console.log(messChange.got_mess_changed)
      messChange.got_mess_changed = true;
      await messChange.save();

    //Remove user's mess change request entry from their current hostel
    await Hostel.updateOne(
      { _id: user.hostel },
      { $pull: { users: { user: user._id } } }
    );

    return res.status(200).json({ message: "Mess change request accepted" });
  } catch (error) {
    console.error("Error accepting mess change request:", error);
    return res.status(500).json({ message: "Server error" });
  }
};




const rejectMessChangeRequest = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Reset mess change-related fields
    user.applied_for_mess_changed = false;
    user.mess_change_button_pressed = false;
    user.applied_hostel_string = "";
    user.next_mess = user.curr_subscribed_mess; // Reset to current mess
    await user.save();

    // Remove user's request from current hostel's users list
    await Hostel.updateOne(
      { _id: user.hostel },
      { $pull: { users: { user: user._id } } }
    );

    return res.status(200).json({ message: "Mess change request rejected" });
  } catch (error) {
    console.error("Error rejecting mess change request:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const messChangeRequest = async (req, res) => {
  const { hostel_name, roll_number } = req.body;

  // console.log("mess change request received ");
  // console.log(hostel_name);
  // console.log(roll_number);
  

  const today = new Date();
  const dayOfMonth = today.getDate();

  if (dayOfMonth < 2 || dayOfMonth > 27) {
    return res.status(403).json({
      message: "Mess change requests are only allowed between the 24th and 27th of the month.",
    });
  }

  try {
    const hostel = await Hostel.findOne({hostel_name });
    const user = await User.findOne({ rollNumber: roll_number });
    let messChange = await MessChange.findOne({rollNumber: roll_number});
    //  console.log(hostel);
    //  console.log(user);
    //  console.log(messChange);
     if (messChange) {
   return res.status(200).json({
        message: "Request already made.",
        status_code: 1,
      });
} 


     
  
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (!hostel) {
      return res.status(404).json({ message: "Mess not found." });
    }

   
    
    user.applied_hostel_string = hostel_name;
    user.mess_change_button_pressed = true;
    
   const user_hostel=  await Hostel.findOne(user.hostel);
    const isDifferentHostel = hostel.messId !== user_hostel.messId;
    // console.log(hostel.messId);
    // console.log(user_hostel.messId);
    // console.log(user.applied_for_mess_changed);
    const hasNotApplied = !user.applied_for_mess_changed;

    if (isDifferentHostel && hasNotApplied) {

      // Update user fields
      user.next_mess = hostel.messId;
      user.applied_for_mess_changed = true;
      await user.save();
      
       const messchangedata = {
    userId: user.userId,
      name:user.name,
      rollNumber : roll_number,
      degree: user.degree,
      hostelId : user.hostel,
      next_mess: hostel.messId
}
     
      const messChange = new MessChange(messchangedata);
     
      await messChange.save();

     

      return res.status(200).json({
        message: "Mess change request processed successfully.",
        status_code: 0,

      });
    } else {
      await user.save(); 
      return res.status(200).json({
        message: "Request denied: capacity full, same hostel selected.",
        status_code: 1,
      });
    }
  } catch (err) {
    console.error("Error during mess change request:", err);
    return res.status(500).json({ message: "Internal server error occurred." });
  }
};


module.exports = {
  getAllMessChangeRequests,
  getAllMessChangeRequestsForAllMess,
  acceptMessChangeRequest,
  rejectMessChangeRequest,
  messChangeRequest
};

