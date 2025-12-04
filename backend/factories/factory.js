const { Sequelize } = require("sequelize");
const config = require("../config/config");

const createDB = function () {
  // console.log("PRODUCTION DB");
  return new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
};

module.exports = {
  createDB,
};
