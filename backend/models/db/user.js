"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}

  User.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(300),
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(300),
      },
      isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      verificationCode: {
        type: DataTypes.STRING(300),
      },
      googleId: {
        type: DataTypes.STRING,
        unique: true,
      },
      verificationTokenExpiry: {
        type: DataTypes.DATE,
      },
      resetPasswordToken: {
        type: DataTypes.STRING(300),
      },
      resetPasswordTokenExpiry: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};
