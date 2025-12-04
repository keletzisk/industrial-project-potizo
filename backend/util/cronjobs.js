const UserRepo = require("../repositories/userRepository");
const { notifyUsersForUnwateredTrees } = require("../services/notifications");
const logger = require("../util/pino");
const cron = require("node-cron");

function cronJobsStart() {
  const notifyUsersForUnwateredTreesJob = cron.schedule(
    "0 8 * * *",
    async () => {
      try {
        logger.info("STARTED CRONJOB: notifyUsersForUnwateredTreesJob");
        await notifyUsersForUnwateredTrees();
        logger.info("ENDED CRONJOB: notifyUsersForUnwateredTreesJob");
      } catch (error) {
        logger.error(error);
      }
    }
  );

  const deleteUnverifiedUsersJob = cron.schedule("*/30 * * * *", async () => {
    try {
      logger.info("STARTED CRONJOB: deleteUnverifiedUsersJob");
      await UserRepo.deleteUnverifiedUsers();
      logger.info("ENDED CRONJOB: deleteUnverifiedUsersJob");
    } catch (error) {
      logger.error(error);
    }
  });

  notifyUsersForUnwateredTreesJob.start();
  deleteUnverifiedUsersJob.start();
}

module.exports = {
  cronJobsStart,
};
