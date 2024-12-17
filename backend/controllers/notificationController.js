const User = require('../models/UserModal');// Replace with the correct path to your User model


const addNotification = async (userId, type, message, postId) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        console.error("User not found for notification");
        return;
      }
  
      user.notifications.push({
        type,
        message,
        post: postId,
        createdAt: Date.now(),
      });
  
      await user.save();
    } catch (error) {
      console.error("Error adding notification:", error);
    }
  };
  

  // Fetch notifications for the logged-in user
const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("notifications");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
  }
};



// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const notification = user.notifications.id(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.read = true;
    await user.save();

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Failed to mark notification as read", error: error.message });
  }
};

module.exports = { addNotification,markNotificationAsRead,getNotifications };