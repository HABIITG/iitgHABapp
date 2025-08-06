const admin = require("./firebase.js");
const Notification = require("./notificationModel.js");
const FCMToken = require("./FCMToken.js");
const { User } = require("../user/userModel.js");

// Register (or update) FCM token for a user
const registerToken = async (req, res) => {
  console.log("Registering FCM token for user:", req.user?._id);
  try {
    console.log("Request body for notifications:", req.body);
    if (!req.user)
      return res.status(403).json({ error: "Only users can register tokens" });

    const { fcmToken } = req.body;
    if (!fcmToken)
      return res.status(400).json({ error: "FCM token is required" });

    await FCMToken.findOneAndUpdate(
      { user: req.user._id },
      { token: fcmToken },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ message: "FCM token registered" });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

// Send notification to all users of this hostel
const sendNotification = async (req, res) => {
  try {
    if (!req.hostel)
      return res
        .status(403)
        .json({ error: "Only hostel admins can send notifications" });

    const { title, body } = req.body;
    console.log(req.hostel);
    const users = await User.find({ hostel: req.hostel });
    const userIds = users.map((u) => u._id);
    const tokens = await FCMToken.find({ user: { $in: userIds } });
    // const fcmTokens = tokens.map((t) => t.fcmToken);

    const fcmTokens = (await FCMToken.find({}));

    console.log("FCM Tokens:", fcmTokens);

    if (fcmTokens.length === 0)
      return res.status(400).json({ error: "No user tokens found" });

    const message = {
      notification: { title, body },
      tokens: fcmTokens,
    };
    
    await admin.messaging().sendEachForMulticast(message);

    await Notification.create({
      title,
      body,
      hostel: req.hostel._id,
      recipients: userIds,
    });

    res.status(200).json({ message: "Notification sent" });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

// Get notifications for user
const getUserNotifications = async (req, res) => {
  try {
    const { user } = req;
    const notifs = await Notification.find({ recipients: user._id })
      .sort({ createdAt: -1 })
      .lean();

    const response = notifs.map((n) => ({
      ...n,
      isRead: n.readBy?.includes(user._id),
    }));

    res.json(response);
  } catch {
    res.sendStatus(500);
  }
};

// Mark a notification as read
const markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif) return res.sendStatus(404);

    if (!notif.readBy.includes(req.user._id)) {
      notif.readBy.push(req.user._id);
      await notif.save();
    }

    res.json({ message: "Marked as read" });
  } catch {
    res.sendStatus(500);
  }
};

module.exports = {
  registerToken,
  sendNotification,
  getUserNotifications,
  markAsRead,
};
