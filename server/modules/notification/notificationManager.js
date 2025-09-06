const admin = require("./firebase.js");

const sendCustomNotificationToAllUsers = (title, body) => {
    admin.messaging().send({
        notification: { title, body },
        topic: "All_Hostels"
    });
};

module.exports = {sendCustomNotificationToAllUsers}