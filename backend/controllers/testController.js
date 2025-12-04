const { sendTestEmail } = require("../helpers/emailHelper");
const { sequelize } = require("../models/db");
const { notifyUsersForUnwateredTrees } = require("../services/notifications");

async function sendEmail(request, response) {
  const email = request.body.email;
  sendTestEmail(email);
  response.status(200).send();
}

async function sendUnwateredNotificationEmails(request, response) {
  await notifyUsersForUnwateredTrees();
  response.status(200).send();
}

async function statistics(request, response) {
  const userQuery =
    "SELECT DATE(createdAt) AS date, COUNT(*) AS count FROM Users where DATE(createdAt)>'2023-07-13' GROUP BY DATE(createdAt) ORDER BY DATE(createdAt);";
  const adoptionQuery =
    "SELECT DATE(createdAt) AS date, COUNT(*) AS count FROM UserTrees where DATE(createdAt)>'2023-07-13' GROUP BY DATE(createdAt) ORDER BY DATE(createdAt);";

  const wateringQuery =
    "SELECT DATE(lastWateredDate) AS date, COUNT(*) AS count FROM Trees where DATE(lastWateredDate)>'2023-07-13' GROUP BY DATE(lastWateredDate) ORDER BY DATE(lastWateredDate);";
  const [users] = await sequelize.query(userQuery);
  const [adoptions] = await sequelize.query(adoptionQuery);
  const [waterings] = await sequelize.query(wateringQuery);
  response
    .status(200)
    .send({ users: users, adoptions: adoptions, waterings: waterings });
}

module.exports = {
  sendEmail,
  sendUnwateredNotificationEmails,
  statistics,
};
