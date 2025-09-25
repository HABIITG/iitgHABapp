const { User } = require("../user/userModel.js");
const { Hostel } = require("../hostel/hostelModel.js");
const { MessChange } = require("./messChangeModel.js");
const { MessChangeSettings } = require("./messChangeSettingsModel.js");
const { sendCustomNotificationToAllUsers } = require("../notification/notificationManager.js");

const getAllMessChangeRequestsForAllHostels = async (req, res) => {
  try {
    const messChangeRequests = await User.find({
      applied_for_mess_changed: true,
    });
    console.log(messChangeRequests);

    if (!messChangeRequests || messChangeRequests.length === 0) {
      console.log("abc");
      return res.status(404).json({ message: "No mess change requests found" });
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

// Helper function to initialize capacity tracker
const initializeCapacityTracker = async (hostels) => {
  const capacityTracker = {};
  for (const hostel of hostels) {
    console.log("hostel", hostel);
    const currentCount = await User.countDocuments({
      curr_subscribed_mess: hostel._id,
    });
    capacityTracker[hostel._id.toString()] = {
      available: (hostel.curr_cap || 0) - currentCount,
    };
  }
  console.log("capacityTracker", capacityTracker);
  return capacityTracker;
};

// Helper function to sort users by priority
const sortUsersByPriority = (users) => {
  return users.sort(
    (a, b) => a.applied_hostel_timestamp - b.applied_hostel_timestamp
  );
};

// Core processing function for N² iterations
const processUsersInIterations = (users, capacityTracker) => {
  const acceptedUsers = [];

  while (users.length > 0) {
    let processedInThisIteration = 0;
    const remainingUsers = [];

    const sortedUsers = sortUsersByPriority(users);
    for (const user of sortedUsers) {
      const targetHostelId = user.next_mess?.toString();
      console.log("targetHostelId", targetHostelId);
      if (!targetHostelId || !capacityTracker[targetHostelId]) {
        // Skip invalid requests - they remain unprocessed
        remainingUsers.push(user);
        continue;
      }
      console.log(
        "capacityTracker[targetHostelId].available",
        capacityTracker[targetHostelId].available
      );
      if (capacityTracker[targetHostelId].available > 0) {
        console.log("accepted");
        acceptedUsers.push({
          id: user._id,
          name: user.name,
          rollNumber: user.rollNumber,
          fromHostelId: user.hostel, // Use user's actual hostel for HAB processed requests
          toHostelId: user.next_mess,
        });
        capacityTracker[targetHostelId].available--;
        processedInThisIteration++;
      } else {
        // Keep for next iteration - don't mark as waitlisted during processing
        remainingUsers.push(user);
      }
    }

    users = remainingUsers;
    console.log("users", users);
    if (processedInThisIteration === 0) break;
  }

  const rejectedUsers = users.map((user) => ({
    id: user._id,
    name: user.name,
    rollNumber: user.rollNumber,
    fromHostelId: user.hostel, // Use user's actual hostel for HAB processed requests
    toHostelId: user.next_mess,
  }));

  return { acceptedUsers, rejectedUsers };
};

// Database update function for accepted users
const updateAcceptedUsers = async (acceptedUsers) => {
  for (const acceptedUser of acceptedUsers) {
    const user = await User.findById(acceptedUser.id);
    if (!user) continue;

    user.curr_subscribed_mess = acceptedUser.toHostelId;
    user.applied_for_mess_changed = false;
    user.got_mess_changed = true;
    user.applied_hostel_string = "";
    user.next_mess = null;
    user.applied_hostel_timestamp = null;
    console.log("user", user);
    await user.save();

    const fromHostel = await Hostel.findById(acceptedUser.fromHostelId);
    const toHostel = await Hostel.findById(acceptedUser.toHostelId);

    // Check if a MessChange record already exists for this user
    const existingRecord = await MessChange.findOne({
      rollNumber: user.rollNumber,
    });

    if (existingRecord) {
      // Update existing record
      existingRecord.userName = user.name;
      existingRecord.fromHostel = fromHostel
        ? fromHostel.hostel_name
        : "Unknown";
      existingRecord.toHostel = toHostel ? toHostel.hostel_name : "Unknown";
      await existingRecord.save();
    } else {
      // Create new record
      const messChangeRecord = new MessChange({
        userName: user.name,
        rollNumber: user.rollNumber,
        fromHostel: fromHostel ? fromHostel.hostel_name : "Unknown",
        toHostel: toHostel ? toHostel.hostel_name : "Unknown",
      });
      await messChangeRecord.save();
    }

    acceptedUser.fromHostel = fromHostel ? fromHostel.hostel_name : "Unknown";
    acceptedUser.toHostel = toHostel ? toHostel.hostel_name : "Unknown";
  }
};

// Reject all pending mess change requests without processing
const rejectAllMessChangeRequests = async (req, res) => {
  try {
    const users = await User.find({ applied_for_mess_changed: true });
    if (!users || users.length === 0) {
      return res
        .status(400)
        .json({ message: "No pending mess change requests found" });
    }

    for (const user of users) {
      user.applied_for_mess_changed = false;
      user.applied_hostel_string = "";
      user.next_mess = user.curr_subscribed_mess;
      user.got_mess_changed = false;
      user.isWaitlisted = false;
      user.waitlistTimestamp = null;
      await user.save();
    }

    await updateLastProcessedTimestamp();

    sendCustomNotificationToAllUsers("Mess Change is Disabled", "Mess Change is Disabled");

    return res.status(200).json({
      message: `Rejected ${users.length} pending requests. Mess change has been automatically disabled.`,
    });
  } catch (error) {
    console.error("Error rejecting all mess change requests:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Database update function for rejected users
const updateRejectedUsers = async (rejectedUsers) => {
  for (const rejectedUser of rejectedUsers) {
    const user = await User.findById(rejectedUser.id);
    if (!user) continue;

    user.applied_for_mess_changed = false;
    user.applied_hostel_string = "";
    user.next_mess = user.curr_subscribed_mess;
    user.got_mess_changed = false;
    await user.save();
  }
};

const processAllMessChangeRequests = async (req, res) => {
  try {
    // Reset all users' mess change status
    await User.updateMany({}, { got_mess_changed: false });

    // Get hostels and users with pending requests
    const hostels = await Hostel.find({});
    const users = await User.find({ applied_for_mess_changed: true });

    if (users.length === 0) {
      return res.status(400).json({ message: "No mess change requests found" });
    }

    // Initialize capacity tracker
    const capacityTracker = await initializeCapacityTracker(hostels);

    // Process users using N² algorithm
    const { acceptedUsers, rejectedUsers } = processUsersInIterations(
      users,
      capacityTracker
    );

    // Update database for all user categories
    await updateAcceptedUsers(acceptedUsers);
    await updateRejectedUsers(rejectedUsers);

    // Automatically disable mess change after processing and update timestamp
    await updateLastProcessedTimestamp();

    sendCustomNotificationToAllUsers("Mess Change is Disabled", "Mess Change is Disabled");

    return res.status(200).json({
      message: `${acceptedUsers.length} requests accepted, ${rejectedUsers.length} rejected. Mess change has been automatically disabled.`,
      acceptedUsers,
      rejectedUsers,
    });
  } catch (error) {
    console.error("Error processing all mess change requests:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAcceptedStudentsByHostel = async (req, res) => {
  try {
    const { hostelName } = req.params;

    if (!hostelName) {
      return res.status(400).json({ message: "Hostel name is required" });
    }

    const acceptedStudents = await MessChange.find({
      toHostel: hostelName,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      message: "Accepted students fetched successfully",
      data: acceptedStudents,
    });
  } catch (error) {
    console.error("Error fetching accepted students:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const messChangeRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const { mess_pref } = req.body;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const settings = await MessChangeSettings.findOne();
    if (!settings || !settings.isEnabled) {
      return res.status(403).json({
        message: "Mess change is currently disabled. Please contact HAB admin.",
      });
    }

    const next_hostel = await Hostel.findOne({ hostel_name: mess_pref });
    if (!next_hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    user.applied_for_mess_changed = true;
    user.applied_hostel_string = mess_pref;
    user.applied_hostel_timestamp = Date.now();
    user.next_mess = next_hostel._id;
    await user.save();

    res.status(200).json({ message: "Request Sent" });
  } catch (e) {
    console.log(`Error: ${e}`);
    res.status(500).json("Internal Server Error");
  }
};

const messChangeCancel = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if mess change is enabled
    const settings = await MessChangeSettings.findOne();
    if (!settings || !settings.isEnabled) {
      return res.status(403).json({
        message: "Mess change is currently disabled. Please contact HAB admin.",
      });
    }

    if (user.applied_for_mess_changed) {
      user.applied_for_mess_changed = false;
      user.applied_hostel_string = "";
      user.applied_hostel_timestamp = new Date(2025, 8, 1);
      user.next_mess = null;
      await user.save();
    }

    res.status(200).json({ message: "Request Sent" });
  } catch (e) {
    console.log(`Error: ${e}`);
    res.status(500).json("Internal Server Error");
  }
};

const messChangeStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Get global mess change status
    const settings = await MessChangeSettings.findOne();
    const isMessChangeEnabled = settings ? settings.isEnabled : false;

    return res.status(200).json({
      message: "User mess change status fetched successfully",
      applied: user.applied_for_mess_changed || false,
      hostel: user.applied_hostel_string || "",
      default: user.hostel || "",
      isMessChangeEnabled,
    });
  } catch (err) {
    console.error("Error in messChangeStatus:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get current mess change status
const getMessChangeStatus = async (req, res) => {
  try {
    let settings = await MessChangeSettings.findOne();

    if (!settings) {
      // Create default settings if none exist
      settings = new MessChangeSettings({
        isEnabled: false,
        enabledAt: null,
        disabledAt: null,
        lastProcessedAt: null,
      });
      await settings.save();
    }

    return res.status(200).json({
      message: "Mess change status fetched successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching mess change status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Enable mess change
const enableMessChange = async (req, res) => {
  try {
    let settings = await MessChangeSettings.findOne();

    if (!settings) {
      settings = new MessChangeSettings({
        isEnabled: true,
        enabledAt: new Date(),
      });
    } else {
      settings.isEnabled = true;
      settings.enabledAt = new Date();
      settings.disabledAt = null;
    }

    await settings.save();
    
    sendCustomNotificationToAllUsers("Mess Change is Enabled", "Mess Change is Enabled");


    return res.status(200).json({
      message: "Mess change enabled successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Error enabling mess change:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Disable mess change
const disableMessChange = async (req, res) => {
  try {
    let settings = await MessChangeSettings.findOne();

    if (!settings) {
      return res
        .status(404)
        .json({ message: "Mess change settings not found" });
    }

    settings.isEnabled = false;
    settings.disabledAt = new Date();

    await settings.save();

    sendCustomNotificationToAllUsers("Mess Change is Disabled", "Mess Change is Disabled");

    return res.status(200).json({
      message: "Mess change disabled successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Error disabling mess change:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update last processed timestamp after processing requests
const updateLastProcessedTimestamp = async () => {
  try {
    let settings = await MessChangeSettings.findOne();

    if (!settings) {
      settings = new MessChangeSettings({
        isEnabled: false,
        lastProcessedAt: new Date(),
        disabledAt: new Date(),
      });
    } else {
      settings.lastProcessedAt = new Date();
      settings.isEnabled = false;
      settings.disabledAt = new Date();
    }

    await settings.save();
  } catch (error) {
    console.error("Error updating last processed timestamp:", error);
  }
};

const getAllAcceptedStudents = async (req, res) => {
  try {
    const allAcceptedStudents = await MessChange.find({}).sort({
      createdAt: 1,
    });

    return res.status(200).json({
      message: "All accepted students fetched successfully",
      data: allAcceptedStudents,
    });
  } catch (error) {
    console.error("Error fetching all accepted students:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get mess change schedule information
const getMessChangeScheduleInfo = async (req, res) => {
  try {
    const settings = await MessChangeSettings.findOne();

    // FOR TESTING: Fixed test dates
    const testEnableDate = new Date("2025-09-07T02:48:00+05:30");
    const testDisableDate = new Date("2025-09-07T04:30:00+05:30");

    return res.status(200).json({
      message: "Mess change schedule information (TEST MODE)",
      data: {
        currentSettings: settings,
        schedule: {
          enablePattern: "TEST: 7 Sept 2025 at 2:15 AM IST",
          disablePattern: "TEST: 7 Sept 2025 at 2:30 AM IST",
          nextEnableDate: testEnableDate.toISOString(),
          nextDisableDate: testDisableDate.toISOString(),
          nextEnableDateIST: testEnableDate.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          }),
          nextDisableDateIST: testDisableDate.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          }),
          isTestMode: true,
        },
        currentTimeIST: new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      },
    });
  } catch (error) {
    console.error("Error fetching mess change schedule info:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Enable mess change function for automatic scheduling (no HTTP response)
const enableMessChangeAutomatic = async () => {
  try {
    let settings = await MessChangeSettings.findOne();

    if (!settings) {
      settings = new MessChangeSettings({
        isEnabled: true,
        enabledAt: new Date(),
      });
    } else {
      settings.isEnabled = true;
      settings.enabledAt = new Date();
      settings.disabledAt = null;
    }

    await settings.save();

    sendCustomNotificationToAllUsers("Enable", "Mess Change is Enabled");
    
    console.log("✅ Mess change enabled automatically");
    return { success: true, settings };
  } catch (error) {
    console.error("❌ Error enabling mess change automatically:", error);
    return { success: false, error };
  }
};


module.exports = {
  getAllMessChangeRequestsForAllHostels,
  processAllMessChangeRequests,
  getAcceptedStudentsByHostel,
  getAllAcceptedStudents,
  messChangeRequest,
  messChangeStatus,
  messChangeCancel,
  getMessChangeStatus,
  enableMessChange,
  disableMessChange,
  rejectAllMessChangeRequests,
  getMessChangeScheduleInfo,
  enableMessChangeAutomatic,
};
