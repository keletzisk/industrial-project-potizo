"use strict";
const { differenceInDays } = require("date-fns");
const { Model } = require("sequelize");

const DAYS_UNTIL_NEEDED_WATERING = 4;

module.exports = (sequelize, DataTypes) => {
  class Tree extends Model {}

  Tree.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      needsWatering: {
        type: DataTypes.VIRTUAL,
        get() {
          if (!this.lastWateredDate) return true;
          return (
            differenceInDays(new Date(), this.lastWateredDate) >
            DAYS_UNTIL_NEEDED_WATERING
          );
        },
      },
      type: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      latitude: {
        type: DataTypes.DOUBLE(15, 12),
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DOUBLE(15, 12),
        allowNull: false,
      },
      zip: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      lastWateredDate: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Tree",
      timestamps: false,
    }
  );

  return Tree;
};
