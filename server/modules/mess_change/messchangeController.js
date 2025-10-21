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
    const currentCount = await User.countDocuments({
      curr_subscribed_mess: hostel._id,
    });
    capacityTracker[hostel._id.toString()] = {
      available: (hostel.curr_cap || 200) - currentCount,
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

// Core processing function: strictly FCFS with rounds per preference and cascading waitlists
const processUsersInIterations = (users, capacityTracker) => {
  // Build user state with current mess and preferences
  const state = new Map();
  const queueOrder = sortUsersByPriority(users);
  for (const u of queueOrder) {
    state.set(u._id.toString(), {
      id: u._id.toString(),
      name: u.name,
      rollNumber: u.rollNumber,
      currentMess: u.curr_subscribed_mess?.toString() || u.hostel?.toString(),
      prefs: [
        u.next_mess1?.toString() || null,
        u.next_mess2?.toString() || null,
        u.next_mess3?.toString() || null,
      ],
    });
  }

  const acceptedUsers = [];
  const acceptedSet = new Set();

  const performMove = (userId, toMess, roundAcceptedUsers, waitlists) => {
    const st = state.get(userId);
    if (!st) return;
    const from = st.currentMess;

    // apply move
    capacityTracker[toMess].available -= 1;
    if (from) capacityTracker[from].available += 1;

    // record acceptance only once per user (on the round they get allocated)
    if (!acceptedSet.has(userId)) {
      roundAcceptedUsers.push({
        id: st.id,
        name: st.name,
        rollNumber: st.rollNumber,
        fromHostelId: from,
        toHostelId: toMess,
      });
      acceptedSet.add(userId);
    } else {
      // If somehow re-moving same user in cascade of same round, ensure the top-level record reflects final toMess
      const idx = roundAcceptedUsers.findIndex((r) => r.id === userId);
      if (idx >= 0) {
        roundAcceptedUsers[idx].toHostelId = toMess;
      }
    }

    st.currentMess = toMess;

    // After freeing a seat in 'from', immediately satisfy earliest waitlist for 'from'
    if (from && capacityTracker[from].available > 0) {
      const wl = waitlists.get(from);
      while (capacityTracker[from].available > 0 && wl && wl.length > 0) {
        const nextUserId = wl.shift();
        // Skip if already accepted in this or previous cascade (defensive)
        const nextState = state.get(nextUserId);
        if (!nextState || nextState.currentMess === from) continue;
        if (capacityTracker[from].available <= 0) break;
        performMove(nextUserId, from, roundAcceptedUsers, waitlists);
      }
    }
  };

  const processRound = (prefIndex) => {
    const roundAcceptedUsers = [];
    const waitlists = new Map(); // messId -> [userIds]

    for (const user of queueOrder) {
      const id = user._id.toString();
      if (acceptedSet.has(id)) continue; // already got a better (earlier) preference
      const st = state.get(id);
      if (!st) continue;
      const toMess = st.prefs[prefIndex];
      const from = st.currentMess;
      if (!toMess || toMess === from) continue;

      // if capacity available allocate, else enqueue to waitlist
      if (capacityTracker[toMess]?.available > 0) {
        performMove(id, toMess, roundAcceptedUsers, waitlists);
      } else {
        if (!waitlists.has(toMess)) waitlists.set(toMess, []);
        waitlists.get(toMess).push(id);
      }
    }

    // Nothing more to do; any cascades are handled immediately inside performMove
    return roundAcceptedUsers;
  };

  // Round 1: first preferences
  const r1 = processRound(0);
  for (const a of r1) acceptedUsers.push(a);
  // Round 2: second preferences for remaining users
  const r2 = processRound(1);
  for (const a of r2) acceptedUsers.push(a);
  // Round 3: third preferences for remaining users
  const r3 = processRound(2);
  for (const a of r3) acceptedUsers.push(a);

  // Remaining users are rejected
  const rejectedUsers = queueOrder
    .filter((u) => !acceptedSet.has(u._id.toString()))
    .map((user) => ({
      id: user._id,
      name: user.name,
      rollNumber: user.rollNumber,
      fromHostelId: user.hostel,
      toHostelId: null,
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
    user.next_mess1 = null;
    user.next_mess2 = null;
    user.next_mess3 = null;
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
    user.next_mess1 = null;
    user.next_mess2 = null;
    user.next_mess3 = null;
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

    // Process users using strict FCFS rounds
    const { acceptedUsers, rejectedUsers } = processUsersInIterations(
      users,
      capacityTracker
    );

    // Update database for all user categories
    await updateAcceptedUsers(acceptedUsers);
    // Removed reallocateImprovedMessChoices to preserve FCFS fairness
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
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const settings = await MessChangeSettings.findOne();
    if (!settings || !settings.isEnabled) {
      return res.status(403).json({
        message: "Mess change is currently disabled. Please contact HAB admin.",
      });
    }

    const { mess_pref_1, mess_pref_2, mess_pref_3 } = req.body || {};

    if (!mess_pref_1) {
      return res.status(400).json({ message: "First preference is required" });
    }

    const resolveHostel = async (name) => {
      if (!name || typeof name !== "string" || !name.trim()) return null;
      return Hostel.findOne({ hostel_name: name.trim() });
    };

    const [h1, h2, h3] = await Promise.all([
      resolveHostel(mess_pref_1),
      resolveHostel(mess_pref_2),
      resolveHostel(mess_pref_3),
    ]);

    if (!h1) {
      return res
        .status(404)
        .json({ message: "First preference hostel not found" });
    }

    const ids = [
      h1?._id?.toString(),
      h2?._id?.toString(),
      h3?._id?.toString(),
    ].filter(Boolean);
    if (new Set(ids).size !== ids.length) {
      return res.status(400).json({ message: "Preferences must be unique" });
    }

    const currentMessId = (
      user.curr_subscribed_mess || user.hostel
    )?.toString();
    if (ids.includes(currentMessId)) {
      return res.status(400).json({
        message: "Please select messes different from your current mess",
      });
    }

    user.applied_for_mess_changed = true;
    user.applied_hostel_string = mess_pref_1;
    user.applied_hostel_timestamp = Date.now();
    user.next_mess1 = h1?._id || null;
    user.next_mess2 = h2?._id || null;
    user.next_mess3 = h3?._id || null;
    await user.save();

    return res.status(200).json({ message: "Request Sent" });
  } catch (e) {
    console.log(`Error: ${e}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const messChangeCancel = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const settings = await MessChangeSettings.findOne();
    if (!settings || !settings.isEnabled) {
      return res.status(403).json({
        message: "Mess change is currently disabled. Please contact HAB admin.",
      });
    }

    if (user.applied_for_mess_changed) {
      user.applied_for_mess_changed = false;
      user.applied_hostel_string = "";
      user.applied_hostel_timestamp = null;
      user.next_mess1 = null;
      user.next_mess2 = null;
      user.next_mess3 = null;
      await user.save();
    }

    return res.status(200).json({ message: "Request Sent" });
  } catch (e) {
    console.log(`Error: ${e}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const messChangeStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const settings = await MessChangeSettings.findOne();
    const isMessChangeEnabled = settings ? settings.isEnabled : false;

    // Resolve preference names
    const [h1, h2, h3] = await Promise.all([
      user.next_mess1 ? Hostel.findById(user.next_mess1) : null,
      user.next_mess2 ? Hostel.findById(user.next_mess2) : null,
      user.next_mess3 ? Hostel.findById(user.next_mess3) : null,
    ]);

    const prefNames = {
      first: h1 ? h1.hostel_name : null,
      second: h2 ? h2.hostel_name : null,
      third: h3 ? h3.hostel_name : null,
    };

    return res.status(200).json({
      message: "User mess change status fetched successfully",
      applied: user.applied_for_mess_changed || false,
      hostel: user.applied_hostel_string || "",
      default: user.hostel || "",
      isMessChangeEnabled,
      preferences: prefNames,
      appliedHostels: [
        prefNames.first,
        prefNames.second,
        prefNames.third,
      ].filter(Boolean),
    });
  } catch (err) {
    console.error("Error in messChangeStatus:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getMessChangeStatus = async (req, res) => {
  try {
    let settings = await MessChangeSettings.findOne();

    if (!settings) {
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
