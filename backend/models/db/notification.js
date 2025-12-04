"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {}

  Notification.init(
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
      category: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      header: {
        type: DataTypes.TEXT,
      },
      message: {
        type: DataTypes.TEXT,
      },
      seen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      sentAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Notification",
    }
  );

  return Notification;
};
