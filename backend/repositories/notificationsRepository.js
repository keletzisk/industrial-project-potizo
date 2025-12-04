const database = require("../models/db");

const NotificationCategory = {
  UNWATERED_TREES: "unwateredTrees",
};

const Notification = database.Notification;
const NotificationsRepository = {
  async getNotSeenNotifications(userId) {
    return await Notification.findAll({
      where: {
        userId,
        seen: false,
      },
    });
  },

  async getUnwateredTreesNotifications(userId) {
    return await Notification.findAll({
      where: {
        userId,
        category: NotificationCategory.UNWATERED_TREES,
      },
    });
  },

  async createUnwateredTreesNotification(userId) {
    return await Notification.create({
      userId,
      category: NotificationCategory.UNWATERED_TREES,
      sentAt: new Date(),
    });
  },

  async setAllNotificationsToSeen(userId) {
    return await Notification.update({ seen: true }, { where: { userId } });
  },
};

module.exports = NotificationsRepository;
