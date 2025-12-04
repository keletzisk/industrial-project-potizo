const bcrypt = require("bcryptjs");

const database = require("../models/db");

const migrations = [
  require("../migrations/20230506192652-create-initial-schema"),
];

const runMigrations = async function (queryInterface, _Sequelize) {
  for (const migration of migrations) {
    await migration.up(queryInterface, _Sequelize);
  }
}

const encryptPassword = async function (password) {
  return await bcrypt.hash(password, 12);
};

const comparePasswords = async function (passwordString, passwordEncrypted) {
  return await bcrypt.compare(passwordString, passwordEncrypted);
};

const getEncryptedUser = async function (userOriginal) {
  const user = { ...userOriginal };
  user.password = await encryptPassword(user.password);
  return user;
};

class DBFixture {
  users = [];
  trees = [];
  userTrees = [];
  notifications = [];

  createUsers = async function (queryInterface, _Sequelize) {
    if (this.users.length === 0) return;

    const encryptedUsers = [];
    for (const user of this.users) {
      encryptedUsers.push(await getEncryptedUser(user));
    }
    await queryInterface.bulkInsert("Users", encryptedUsers);
  };

  createTrees = async function (queryInterface, _Sequelize) {
    if (this.trees.length === 0) return;
    await queryInterface.bulkInsert("Trees", this.trees);
  };

  createUserTrees = async function (queryInterface, _Sequelize) {
    if (this.userTrees.length === 0) return;
    await queryInterface.bulkInsert("UserTrees", this.userTrees);
  };

  createNotifications = async function (queryInterface, _Sequelize) {
    if (this.notifications.length === 0) return;
    await queryInterface.bulkInsert("Notifications", this.notifications);
  };

  prepareFreshDB = async function () {
    const queryInterface = database.sequelize.getQueryInterface();
    await queryInterface.dropAllTables();
    await runMigrations(queryInterface, database.Sequelize);
    await this.createUsers(queryInterface, database.Sequelize);
    await this.createTrees(queryInterface, database.Sequelize);
    await this.createUserTrees(queryInterface, database.Sequelize);
    await this.createNotifications(queryInterface, database.Sequelize);
  };

  populate = async function (data) {
    this.users = data.users ?? [];
    this.trees = data.trees ?? [];
    this.userTrees = data.userTrees ?? [];
    this.notifications = data.notifications ?? [];
    await this.prepareFreshDB();
  };

  logUsers = async function () {
    database.User.findAll()
      .then((users) => {
        console.log(users);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  getUserTrees = async function (userId) {
    return await database.UserTree.findAll({
      where: { userId },
    });
  };

  getUserByEmail = async function (email) {
    return await database.User.findOne({
      where: { email },
    });
  };

  getTreeWateredDate = async function (id) {
    const tree = await database.Tree.findOne({
      where: { id },
    });

    if (tree?.lastWateredDate) {
      return tree.lastWateredDate.toISOString().split("T")[0];
    }
    return null;
  };

  getUnseenNotifications = async function (userId) {
    return await database.Notification.findAll({
      where: { userId, seen: false },
    });
  };

  async addUser(user) {
    await database.User.create(await getEncryptedUser(user));
  }

  async addTree(tree) {
    await database.Tree.create(tree);
  }

  async addUserTree(userTree) {
    await database.UserTree.create(userTree);
  }
}

module.exports = {
  comparePasswords,
  DBFixture,
};
