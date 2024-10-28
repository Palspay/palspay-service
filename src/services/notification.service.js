// services/notification.service.js
const admin = require('firebase-admin');
const User = require('../models/user.model'); // Adjust the path according to your project structure

const sendNotification = async (userId, title, body) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.fcmToken) {
      console.log('No FCM token found for user:', userId);
      return;
    }

    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: user.fcmToken,
    };

    await admin.messaging().send(message);
    console.log('Notification sent successfully to:', userId);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

module.exports = {
  sendNotification,
};
