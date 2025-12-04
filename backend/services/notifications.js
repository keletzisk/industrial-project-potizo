const { sendWateringNotification } = require("../helpers/emailHelper");
const { differenceInDays, compareDesc } = require("date-fns");
const NotificationsRepo = require("../repositories/notificationsRepository");
const UserRepo = require("../repositories/userRepository");
const TreeRepo = require("../repositories/treeRepository");
const { NOTIFICATION_UNWATERED_MESSAGE } = require("../util/language");

async function notifyUsersForUnwateredTrees() {
  const userTrees = await TreeRepo.getAllUserTreeData();
  const usersNotified = [];

  for (const userTree of userTrees) {
    const userId = userTree.userId;
    if (usersNotified.includes(userId)) continue;

    const tree = await TreeRepo.getTreeInfoByID(userTree.treeId);

    if (!tree.needsWatering) continue;

    const notifications =
      await NotificationsRepo.getUnwateredTreesNotifications(userId);

    if (!shouldNotifyUser(notifications, new Date())) continue;

    usersNotified.push(userId);

    const user = await UserRepo.getUserEmailById(userTree.userId);
    const message = NOTIFICATION_UNWATERED_MESSAGE;

    await NotificationsRepo.createUnwateredTreesNotification(userId);
    sendWateringNotification(user.email, message);
  }
}

function shouldNotifyUser(notifications, now) {
  // if there are no notifications send one
  if (notifications.length === 0) return true;

  // the array needs to be sorted in descending order so that the first element is the most recent date
  notifications.sort((a, b) =>
    compareDesc(new Date(a.sentAt), new Date(b.sentAt))
  );

  // the date is always defined since the array is not empty
  const latestNotificationSentAt = new Date(notifications[0].sentAt);

  // Find the index of the last seen notification
  const lastSeenNotificationIndex = notifications.findIndex(
    (notification) => notification.seen
  );

  const notSeenNotificationsCount =
    lastSeenNotificationIndex === -1
      ? notifications.length
      : notifications.slice(0, lastSeenNotificationIndex).length;

  const daysSinceLatestNotification = differenceInDays(
    now,
    latestNotificationSentAt
  );

  return daysSinceLatestNotification >= Math.pow(2, notSeenNotificationsCount);
}

module.exports = {
  notifyUsersForUnwateredTrees,
  shouldNotifyUser,
};
