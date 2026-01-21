require("dotenv").config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require("mongoose");
const { User } = require("../modules/user/userModel.js");

const MONGOdb_uri = process.env.MONGODB_URI;

async function createAnonymizedUser() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGOdb_uri);
    console.log("MongoDB connected");

    const ANONYMIZED_USER_ID = new mongoose.Types.ObjectId('000000000000000000000000');
    
    const anonymizedUser = await User.findById(ANONYMIZED_USER_ID);
    
    if (!anonymizedUser) {
      const user = new User({
        _id: ANONYMIZED_USER_ID,
        name: "Deleted User",
        rollNumber: "DELETED",
        email: null,
        authProvider: "microsoft",
        hasMicrosoftLinked: false,
      });
      
      await user.save();
      console.log("✅ Anonymized user created successfully");
    } else {
      console.log("ℹ️ Anonymized user already exists");
    }

    await mongoose.connection.close();
    console.log("Connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error creating anonymized user:", error);
    process.exit(1);
  }
}

createAnonymizedUser();

