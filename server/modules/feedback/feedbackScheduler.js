const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const xlsx = require('xlsx');
const { User } = require('../user/userModel');

const authId = process.env.OUTLOOK_ID;
const authPass = process.env.OUTLOOK_PASS;
const name_id = process.env.NAME_ID;

const feedbackFilePath = path.join(__dirname, '../output', 'Feedback_Report.xlsx');

// Schedule to send feedback report email ( on 1st of every month at 12 PM) -
const feedbackScheduler = () => {
  schedule.scheduleJob('0 12 1 * *', async () => {
  console.log('time approach')
    try {
      if (!fs.existsSync(feedbackFilePath)) {
        console.log('Feedback file not found. Skipping email.');
        return;
      }

      const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
          user: authId,
          pass: authPass,
        },
      });

      const mailOptions = {
        from: `"${name_id}" <${authId}>`,
        to: 'krish.raj@iitg.ac.in', // Change to hab one
        subject: 'Monthly Feedback Report',
        text: 'PFA the monthly feedback report from students.',
        attachments: [
          {
            filename: 'Feedback_Report.xlsx',
            path: feedbackFilePath,
          },
        ],
      };

      const info = await transporter.sendMail(mailOptions); // generate message id
      console.log(`Feedback report email sent: ${info.messageId}`);
    } catch (err) {
      console.error('Failed to send feedback report:', err);
    }
  });
};

const feedbackResetScheduler = () => {
  // 10th of every month at 12 PM better as no clash of the multiple requests at single time
  schedule.scheduleJob('48 13 8 * *', async () => {
    try {
      // Reset all users feedback bool in User
      await User.updateMany({}, { $set: { feedbackSubmitted: false } });

      // reset the sheet and initialize new sheet
      if (fs.existsSync(feedbackFilePath)) {
        const workbook = xlsx.utils.book_new();
        const emptySheet = xlsx.utils.json_to_sheet([]);
        xlsx.utils.book_append_sheet(workbook, emptySheet, 'Feedback');
        xlsx.writeFile(workbook, feedbackFilePath);
        console.log('Feedback Excel file reset to empty.');
      } else {
        console.log('No feedback Excel file found to reset.');
      }

      console.log('All feedbacks reset successfully.');
    } catch (error) {
      console.error('Error resetting feedbacks:', error);
    }
  });
};



module.exports = {
feedbackResetScheduler,
  feedbackScheduler,
};
