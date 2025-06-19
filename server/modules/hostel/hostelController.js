const { User } = require("../user/userModel.js");
const { Hostel } = require("./hostelModel.js");

const createHostel = async (req, res) => {
  try {
    const hostel = await Hostel.create(req.body);

    return res
      .status(201)
      .json({ message: "Hostel created successfully", hostel });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error occured" });
  }
};

const loginHostel = async (req, res) => {
  const { hostel_name, password } = req.body;

  try {
    const hostel = await Hostel.findOne({ hostel_name });
    if (!hostel) return res.status(400).json({ message: "No such hostel" });

    const verify = await hostel.verifyPassword(password);
    if (!verify) return res.status(401).json({ message: "Incorrect password" });

    const token = hostel.generateJWT();
    return res.status(201).json({
      message: "Logged in successfully",
      token,
      hostel,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error occured" });
  }
};

const getHostel = async (req, res) => {
  return res.json({ hostel: req.hostel });
};

const getAllHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find();

    return res.status(200).json(hostels);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error occured" });
  }
};

const applyMessChange = async (req, res) => {
  const { hostel_name, roll_number, reason } = req.body;

  const today = new Date();

  const dayOfMonth = today.getDate();

  if (dayOfMonth < 24 || dayOfMonth > 27) {
    return res.status(403).json({
      message:
        "Mess change requests only allowed between 24th and 27th of a month",
    });
  }

  try {
    const hostel = await Hostel.findOne({ hostel_name: hostel_name });

    // console.log(hostel);
    // console.log(hostel.curr_cap);

    const user = await User.findOne({ rollNumber: roll_number });

    user.applied_hostel_string = hostel_name;

    user.mess_change_button_pressed = true;

    if (
      hostel != user.hostel &&
      hostel.curr_cap < 150 &&
      !user.applied_for_mess_changed
    ) {
      //const user_permanent_hostel = await Hostel.findById(user.hostel);

      const user_curr_subscribed_mess = await Hostel.findById(
        user.curr_subscribed_mess
      );

      hostel.curr_cap = hostel.curr_cap + 1;

      user.next_mess = hostel._id;

      // user.curr_subscribed_mess = hostel._id;

      user.applied_for_mess_changed = true;

      user_curr_subscribed_mess.users.pull({ user: user._id });

      hostel.users.push({ user: user._id, reason_for_change: reason });
      // user_permanent_hostel.users.pull({user: user._id});

      await user.save();

      await hostel.save();

      await user_curr_subscribed_mess.save();

      //await user_permanent_hostel.save();

      return res
        .status(200)
        .json({ message: "Mess change request proceeded", status_code: 0 });
    } else {
      // capacity reached

      await user.save();

      // await hostel.save();
      return res.status(200).json({
        message:
          "Sorry the cap has reached or you have already applied or you cannot apply for same hostel",
        status_code: 1,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error occured" });
  }
};

module.exports = {
  createHostel,
  loginHostel,
  getHostel,
  getAllHostels,
  applyMessChange,
};
