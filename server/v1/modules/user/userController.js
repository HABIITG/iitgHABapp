const { User } = require("./userModel.js");
const { Hostel } = require("../hostel/hostelModel.js");
const mongoose = require("mongoose");
const Feedback = require("../feedback/feedbackModel.js");
const { ScanLogs } = require("../mess/ScanLogsModel.js");
const FCMToken = require("../notification/FCMToken.js");
const Notification = require("../notification/notificationModel.js");
const { MenuItem } = require("../mess/menuItemModel.js");
const { MessChange } = require("../mess_change/messChangeModel.js");
const UserAllocHostel = require("../hostel/hostelAllocModel.js");
const AppError = require("../../utils/appError.js");

const getUserData = async (req, res, next) => {
  //console.log(req);
  return res.json(req.user);
};

const getUserByRoll = async (req, res) => {
  const { qr } = req.params;

  try {
    const user = await User.findOne({ rollNumber: qr });

    if (!user) {
      return res.status(400).json({ message: "No such roll exists" });
    }

    return res.status(200).json({ message: "User found", user: user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error occured" });
  }
};

const createUser = async (req, res) => {
  try {
    const fetchedUser = await User.findOne({ email: req.body.email });
    if (fetchedUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create(req.body);

    const token = user.generateJWT();

    res.status(201).json({
      message: "User created successfully",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err });
    console.log(err);
  }
};

const deleteUser = async (req, res) => {
  const { outlook } = req.params;
  try {
    const deletedUser = await User.findOneAndDelete({ outlookID: outlook });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(deletedUser);
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
};
const updateUser = async (req, res) => {
  const { outlook } = req.params;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: outlook },
      req.body,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating user" });
  }
};

// Update roomNumber and phoneNumber for the authenticated user
const saveUserProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { roomNumber, phoneNumber } = req.body;
    let changed = false;
    
    // Handle roomNumber: accept string (including empty string) or null/undefined
    if (roomNumber !== undefined) {
      user.roomNumber = roomNumber || null; // Convert empty string to null
      changed = true;
    }
    
    // Handle phoneNumber: accept string (including empty string) or null/undefined
    if (phoneNumber !== undefined) {
      user.phoneNumber = phoneNumber || null; // Convert empty string to null
      changed = true;
    }

    if (changed) {
      await user.save();
      return res.status(200).json({ message: "Profile saved", user });
    }

    return res.status(400).json({ message: "No valid fields provided" });
  } catch (err) {
    console.error("saveUserProfile error", err);
    return res
      .status(500)
      .json({ message: "Failed to save profile", error: String(err) });
  }
};

const getUserComplaints = async (req, res) => {
  const { outlook } = req.params;
  try {
    const user = await User.findOne({ outlookID: outlook }, "complaints");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user complaints" });
  }
};

// const getEmailsOfHABUsers = async (req, res) => {
//     try {
//         const emails = await User.find({ role: 'hab' }, 'email');

//         if (emails.length === 0) {
//             return res.status(404).json({ message: 'Emails not found'});
//         }
//         res.status(200).json(emails);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: 'Error fetching emails'} );
//     }
// };

// const getEmailsOfSecyUsers = async (req, res) => {
//     try {
//         const emails = await User.find({ role: 'welfare_secy' }, 'email');

//         if (emails.length === 0) {
//             return res.status(404).json({ message: 'Emails not found'});
//         }
//         res.status(200).json(emails);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: 'Error fetching emails'} );
//     }
// };

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    // Map over users and populate both hostel and mess names
    const updatedUsers = await Promise.all(
      users.map(async (user) => {
        const hostelId = user.hostel;
        const messId = user.curr_subscribed_mess;
        let hostelName = null;
        let messName = null;

        if (hostelId) {
          const hostel = await Hostel.findById(hostelId);
          hostelName = hostel ? hostel.hostel_name : null;
        }

        if (messId) {
          const mess = await Hostel.findById(messId);
          messName = mess ? mess.hostel_name : null;
        }

        const userObj = user.toObject();
        userObj.hostel_name = hostelName;
        userObj.curr_subscribed_mess_name = messName;

        return userObj;
      })
    );

    res.status(200).json(updatedUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

const getUsersByHostelForMess = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!hostelId) {
      return res.status(400).json({ message: "Hostel ID is required" });
    }

    // Convert page and limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Query users who are currently subscribed to this mess (curr_subscribed_mess equals hostelId)
    const query = { curr_subscribed_mess: hostelId };

    // Get total count for pagination
    const totalCount = await User.countDocuments(query);

    // Get users with pagination and populate hostel information
    const users = await User.find(query)
      .populate("hostel", "hostel_name")
      .populate("curr_subscribed_mess", "hostel_name")
      .select("name rollNumber email hostel curr_subscribed_mess")
      .sort({ name: 1 })
      .skip(skip)
      .limit(limitNum);

    console.log(`Found ${users.length} users for hostel ${hostelId}`);

    res.status(200).json({
      message: "Users fetched successfully",
      count: totalCount,
      users: users,
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
      hasPrevPage: pageNum > 1,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users by hostel" });
  }
};

// Delete user account (hard delete after anonymization)
const deleteUserAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return next(new AppError(404, "User not found"));
    }
    
    // Check for pending mess change applications
    const hasPendingMessChange = user.applied_for_mess_changed && 
                                 !user.got_mess_changed;
    
    if (hasPendingMessChange) {
      return next(new AppError(400, "Cannot delete account with pending mess change application. Please wait for processing or contact admin to cancel."));
    }
    
    // Check if user is SMC member
    if (user.isSMC === true) {
      return next(new AppError(403, "SMC members cannot delete their accounts. Please contact admin."));
    }
    
    // Anonymized user ID for references
    const ANONYMIZED_USER_ID = new mongoose.Types.ObjectId('000000000000000000000000');
    
    // Start transaction for atomic operations
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // 1. FCM Tokens - DELETE (no historical value)
      await FCMToken.deleteMany({ user: userId }, { session });
      
      // 2. Notifications - Remove user from recipients and readBy
      await Notification.updateMany(
        { recipients: userId },
        { $pull: { recipients: userId } },
        { session }
      );
      await Notification.updateMany(
        { readBy: userId },
        { $pull: { readBy: userId } },
        { session }
      );
      
      // 3. Menu Item Likes - Remove user from likes arrays
      await MenuItem.updateMany(
        { likes: userId },
        { $pull: { likes: userId } },
        { session }
      );
      
      // 4. Feedback - Anonymize user reference only (keep feedback content unchanged)
      await Feedback.updateMany(
        { user: userId },
        { $set: { user: ANONYMIZED_USER_ID } },
        { session }
      );
      
      // 5. Scan Logs - Anonymize (keep historical scan data)
      await ScanLogs.updateMany(
        { userId: userId },
        { $set: { userId: ANONYMIZED_USER_ID } },
        { session }
      );
      
      // 6. Update UserAllocHostel with user's final hostel and mess before deletion
      if (user.rollNumber && user.hostel && user.curr_subscribed_mess) {
        await UserAllocHostel.updateOne(
          { rollno: user.rollNumber },
          { 
            $set: { 
              hostel: user.hostel,
              current_subscribed_mess: user.curr_subscribed_mess
            } 
          },
          { session }
        );
      }
      
      // 7. Anonymize MessChange records (update userName)
      if (user.rollNumber) {
        await MessChange.updateMany(
          { rollNumber: user.rollNumber },
          { $set: { userName: "Deleted User" } },
          { session }
        );
      }
      
      // 8. Hard delete user account
      await User.findByIdAndDelete(userId, { session });
      
      // Commit transaction
      await session.commitTransaction();
      
      return res.status(200).json({ 
        success: true,
        message: "Account deleted successfully",
        note: "Your account has been deleted. Historical data has been anonymized for institutional records."
      });
      
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
    
  } catch (err) {
    console.error("Error deleting user account:", err);
    return next(new AppError(500, "Account deletion failed"));
  }
};

module.exports = {
  getUserData,
  createUser,
  deleteUser,
  updateUser,
  saveUserProfile,
  // getEmailsOfHABUsers,
  // getEmailsOfSecyUsers,
  getUserComplaints,
  getUserByRoll,
  getAllUsers,
  getUsersByHostelForMess,
  deleteUserAccount,
};
