const schedule = require("node-schedule");
const {
  enableMessChangeAutomatic,
  processAllMessChangeRequests,
} = require("./messchangeController.js");

// Initialize schedulers
const initializeMessChangeScheduler = () => {
  console.log("🚀 Initializing mess change automatic scheduler...");

  // For testing: Enable at 7 Sept 2:15 AM IST, Disable at 7 Sept 2:30 AM IST
  const now = new Date();
  const istTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  console.log("🌏 Current IST time:", istTime.toLocaleString("en-IN"));

  // TEST SCHEDULE - Enable at 2:15 AM IST on 7 Sept 2025
  const testEnableDate = new Date("2025-09-07T03:22:00+05:30");
  const enableJob = schedule.scheduleJob(
    "mess-change-enable",
    testEnableDate,
    () => {
      console.log(
        "⏰ TEST: Mess change enable schedule triggered at:",
        new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
      );
      enableMessChangeAutomatic();
    }
  );

  // TEST SCHEDULE - Disable at 2:30 AM IST on 7 Sept 2025
  const testDisableDate = new Date("2025-09-07T03:23:00+05:30");
  const disableJob = schedule.scheduleJob(
    "mess-change-disable",
    testDisableDate,
    async () => {
      console.log(
        "⏰ TEST: Mess change disable schedule triggered at:",
        new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
      );

      // First, process all pending requests using existing controller function
      console.log(
        "🔄 Starting automatic processing of mess change requests..."
      );

      const mockReq = {};
      let processResult = { acceptedCount: 0, rejectedCount: 0 };

      const mockRes = {
        status: (code) => ({
          json: (data) => {
            console.log(`📊 Processing response (${code}):`, data.message);
            if (data.acceptedUsers && data.rejectedUsers) {
              processResult = {
                acceptedCount: data.acceptedUsers.length,
                rejectedCount: data.rejectedUsers.length,
              };
            }
            return data;
          },
        }),
      };

      try {
        await processAllMessChangeRequests(mockReq, mockRes);
        console.log(
          `📊 Auto-processing result: ${processResult.acceptedCount} accepted, ${processResult.rejectedCount} rejected`
        );
      } catch (error) {
        console.error("❌ Error in automatic processing:", error);
      }

      // Mess change is already disabled by the processAllMessChangeRequests function
      console.log("✅ Mess change processing and disabling complete");
    }
  );

  // Verify jobs are scheduled
  if (enableJob) {
    console.log(
      "✅ TEST: Mess change enable scheduler initialized successfully"
    );
    console.log(
      "📅 TEST Enable scheduled for:",
      testEnableDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    );
  } else {
    console.error("❌ Failed to initialize mess change enable scheduler");
  }

  if (disableJob) {
    console.log(
      "✅ TEST: Mess change disable scheduler initialized successfully"
    );
    console.log(
      "📅 TEST Disable scheduled for:",
      testDisableDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    );
  } else {
    console.error("❌ Failed to initialize mess change disable scheduler");
  }

  console.log("🧪 TEST SCHEDULE ACTIVE:");
  console.log("   • Enable: 7 Sept 2025 at 2:15 AM IST");
  console.log("   • Disable: 7 Sept 2025 at 2:18 AM IST");
  console.log(
    "   • Current time:",
    new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
  );
};

// Export functions
module.exports = {
  initializeMessChangeScheduler,
};
