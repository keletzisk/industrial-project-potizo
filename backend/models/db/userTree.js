"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserTree extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.belongsToMany(models.Tree, {
        through: models.UserTree,
        foreignKey: "userId",
      });
      models.Tree.belongsToMany(models.User, {
        through: models.UserTree,
        foreignKey: "treeId",
      });
    }
  }

  UserTree.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,

        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: sequelize.User,
          key: "id",
        },
        allowNull: false,
      },
      treeId: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: sequelize.User,
          key: "id",
        },
        allowNull: false,
      },
      treeNickname: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "UserTree",
    }
  );
  return UserTree;
};
