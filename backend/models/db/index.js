const fs = require("node:fs");
const path = require("node:path");
const Sequelize = require("sequelize");
const { createDB } = require("../../factories/factory");
const basename = path.basename(__filename);

const database = {};

const sequelize = createDB();

for (const file of fs.readdirSync(__dirname).filter((file) => {
  return (
    file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  );
})) {
  const model = require(path.join(__dirname, file))(
    sequelize,
    Sequelize.DataTypes
  );
  database[model.name] = model;
}

for (const modelName of Object.keys(database)) {
  if (database[modelName].associate) {
    database[modelName].associate(database);
  }
}

database.sequelize = sequelize;
database.Sequelize = Sequelize;

module.exports = database;
