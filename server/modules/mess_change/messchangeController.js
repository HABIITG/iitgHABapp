const { User } = require("../user/userModel.js");
const { Hostel } = require("../hostel/hostelModel.js");

const getAllMessChangeRequests = async (req, res) => {
  const { hostelId } = req.params;

  try {
    const messChangeRequests = await User.find({ next_mess: hostelId, applied_for_mess_changed: true })
                              .sort({ applied_hostel_timestamp: 1 }); // first come first serve

    if (!messChangeRequests || messChangeRequests.length === 0) {
      return res
        .status(404)
        .json({ message: "No mess change requests found for this hostel" });
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
    const messChangeRequests = await User.find({applied_for_mess_changed: true});

    if (!messChangeRequests || messChangeRequests.length === 0) {
      return res
        .status(404)
        .json({ message: "No mess change requests found for this hostel" });
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

const acceptAndRejectByFCFS = async (req, res) => {
  try {
    const { hostelId } = req.params;

    // Fetch the hostel to get capacity
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    const capacity = hostel.capacity;

    // Count how many users are already subscribed to this mess
    const currentCount = await User.countDocuments({
      curr_subscribed_mess: hostelId,
    });

    const availableSlots = capacity - currentCount;

    if (availableSlots <= 0) {
      return res.status(400).json({ message: "Mess is already full." });
    }

    // Fetch all requests for this hostel, sorted by FCFS
    const allRequests = await User.find({
      next_mess: hostelId,
      applied_for_mess_changed: true,
    }).sort({ applied_hostel_timestamp: 1 });

    const acceptedUsers = [];
    const rejectedUsers = [];

    for (let i = 0; i < allRequests.length; i++) {
      const user = allRequests[i];

      if (i < availableSlots) {
        // Accept the request
        user.curr_subscribed_mess = user.next_mess;
        user.applied_for_mess_changed = false;
        user.got_mess_changed = true;
        user.mess_change_button_pressed = false;
        await user.save();

        acceptedUsers.push({
          id: user._id,
          name: user.name,
          rollNumber: user.rollNumber,
        });
      } else {
        // Reject the request
        user.applied_for_mess_changed = false;
        user.mess_change_button_pressed = false;
        user.applied_hostel_string = "";
        user.next_mess = user.curr_subscribed_mess;
        await user.save();
        
        rejectedUsers.push({
          id: user._id,
          name: user.name,
          rollNumber: user.rollNumber,
        });
      }
    }

    return res.status(200).json({
      message: `${acceptedUsers.length} requests accepted, ${rejectedUsers.length} rejected.`,
      acceptedUsers,
      rejectedUsers,
    });

  } catch (error) {
    console.error("Error processing mess change requests:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const acceptMessChangeRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).populate("next_mess");
    if (!user) return res.status(404).json({ message: "User not found" });

    // check mess capacity before accepting
    const mess = user.next_mess;
    const currentCount = await User.countDocuments({ curr_subscribed_mess: mess._id });
    if (currentCount >= mess.capacity) {
      return res.status(400).json({ message: "Capacity full for this mess." });
    }

    //Update user's mess details
    user.curr_subscribed_mess = user.next_mess;
    user.applied_for_mess_changed = false;
    user.got_mess_changed = true;
    user.mess_change_button_pressed = false;
    await user.save();

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

    return res.status(200).json({ message: "Mess change request rejected" });
  } catch (error) {
    console.error("Error rejecting mess change request:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const messChangeRequest = async (req, res) => {
  try {
    // const today = new Date();
    // const dayOfMonth = today.getDate();

    // if (dayOfMonth < 24 || dayOfMonth > 27) {
    //   return res.status(202).json({
    //     message: "Mess change requests are only allowed between the 24th and 27th of the month.",
    //   });
    // }

    const user = req.user;
    const { mess_pref } = req.body;
    if (!req.user) {
      return res.status(404).json({message: "User not Found"})
    }

    const next_mess = await Hostel.findOne({hostel_name: user.mess_pref});
    // if (!next_mess) return res.status(404).json({ message: "Mess not found" }); // foff during testing

    user.applied_for_mess_changed = true;
    user.applied_hostel_string = mess_pref;
    user.applied_hostel_timestamp = Date.now();
    user.next_mess = next_mess._id || user.next_mess; // || user.next_mess for testing as only kapili is there
    await user.save();

    res.status(200).json({message: "Request Sent"})
  } catch (e) {
    console.log(`Error: ${e}`);
    res.status(500).json("Internal Server Error")
  }



  //  try {
  //    const hostel = await Hostel.findOne({hostel_name });
  //    const user = await User.findOne({ rollNumber: roll_number });
  //    let messChange = await MessChange.findOne({rollNumber: roll_number});
  //        if (!user) {
  //          return res.status(404).json({ message: "User not found." });
  //        }
  //        if (!hostel) {
  //          return res.status(404).json({ message: "Mess not found." });
  //        }
  //    //  console.log(hostel);
  //    //  console.log(user);
  //    //  console.log(messChange);
  //     if (messChange) {
  //   return res.status(200).json({
  //        message: "Request already made.",
  //        status_code: 1,
  //      });

  //   user.applied_hostel_string = hostel_name;
  //   user.mess_change_button_pressed = true;

  //   const user_hostel = await Hostel.findOne(user.hostel);
  //   const isDifferentHostel = hostel.messId !== user_hostel.messId;
  //   // console.log(hostel.messId);
  //   // console.log(user_hostel.messId);
  //   // console.log(user.applied_for_mess_changed);
  //   const hasNotApplied = !user.applied_for_mess_changed;

  //   if (isDifferentHostel && hasNotApplied) {

  //     // Update user fields
  //     user.next_mess = hostel.messId;
  //     user.applied_for_mess_changed = true;
  //     await user.save();

  //     const messchangedata = {
  //       userId: user.userId,
  //       name: user.name,
  //       rollNumber: roll_number,
  //       degree: user.degree,
  //       hostelId: user.hostel,
  //       next_mess: hostel.messId
  //     }

  //     const messChange = new MessChange(messchangedata);

  //     await messChange.save();

  //     return res.status(200).json({
  //       message: "Mess change request processed successfully.",
  //       status_code: 0,

  //     });
  //   } else {
  //     await user.save();
  //     return res.status(200).json({
  //       message: "Request denied: capacity full, same hostel selected.",
  //       status_code: 1,
  //     });
  //   }
  // } catch (err) {
  //   console.error("Error during mess change request:", err);
  //   return res.status(500).json({ message: "Internal server error occurred." });
  // }
};

module.exports = {
  getAllMessChangeRequests,
  getAllMessChangeRequestsForAllMess,
  acceptAndRejectByFCFS,
  acceptMessChangeRequest,
  rejectMessChangeRequest,
  messChangeRequest,
};
