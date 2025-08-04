const { User } = require("../user/userModel.js");
const { Hostel } = require("./hostelModel.js");
const { Mess } = require("../mess/messModel.js");

const createHostel = async (req, res) => {
  try {
    const hostel = await Hostel.create(req.body);

    // const assignMess = await Mess.findByIdAndUpdate(req.body.messId, {
    //   hostelId: hostel._id,
    // });

    // if (!assignMess) {
    //   return res.status(400).json({ message: "Mess not found" });
    // }

    return res
      .status(201)
      .json({ message: "Hostel created successfully", hostel });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error occurred" });
  }
};

const loginHostel = async (req, res) => {
  const { hostel_name, password } = req.body;
  try {
    const hostel = await Hostel.findOne({ hostel_name }).populate("messId");
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
    return res.status(500).json({ message: "Error occurred" });
  }
};

const getHostel = async (req, res) => {
  // console.log("xyz", req.hostel);
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

const getAllHostelsWithMess = async (req, res) => {
  try {
    const hostels = await Hostel.find().populate("messId");
    return res.status(200).json(hostels);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error occurred" });
  }
};

const getHostelbyId = async (req, res) => {
  const { hostelId } = req.params;
  try {
    const hostel = await Hostel.findById(hostelId)
      .populate("messId", "name")
      .populate("users.user", "name rollNumber degree");

    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    return res.status(200).json({ message: "Hostel found", hostel });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error occurred" });
  }
};

const deleteHostel = async (req, res) => {
  try {
    const hostelId = req.params.hostelId;
    const deletedHostel = await Hostel.findByIdAndDelete(hostelId);
    if (!deletedHostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }
    return res.status(200).json({ message: "Hostel deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
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
    const hostel = await Hostel.findOne({ hostel_name });
    const user = await User.findOne({ rollNumber: roll_number });

    user.applied_hostel_string = hostel_name;
    user.mess_change_button_pressed = true;

    if (
      hostel &&
      hostel._id.toString() !== user.hostel.toString() &&
      hostel.curr_cap < 150 &&
      !user.applied_for_mess_changed
    ) {
      const userCurrMess = await Hostel.findById(user.curr_subscribed_mess);

      hostel.curr_cap += 1;
      user.next_mess = hostel._id;
      user.applied_for_mess_changed = true;

      userCurrMess.users.pull({ user: user._id });
      hostel.users.push({ user: user._id, reason_for_change: reason });

      await user.save();
      await hostel.save();
      await userCurrMess.save();

      return res.status(200).json({
        message: "Mess change request proceeded",
        status_code: 0,
      });
    } else {
      await user.save();
      return res.status(200).json({
        message:
          "Sorry, the capacity has been reached or you have already applied or you're applying for the same hostel",
        status_code: 1,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error occurred" });
  }
};

const getAllHostelNameAndCaterer = async (req, res) => {
  try {
    const hostelData = await Hostel.find(
      {},
      { hostel_name: 1, messId: 1 }
    ).populate({
      path: "messId",
      select: "name -_id",
    });

    res.status(200).json(hostelData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createHostel,
  loginHostel,
  getHostel,
  getAllHostels,
  getAllHostelsWithMess,
  getHostelbyId,
  deleteHostel,
  applyMessChange,
  getAllHostelNameAndCaterer,
};
