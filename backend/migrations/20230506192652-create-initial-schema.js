"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(300),
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(300),
      },
      isBlocked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      verificationCode: {
        type: Sequelize.STRING(300),
      },
      googleId: {
        type: Sequelize.STRING,
        unique: true,
      },
      verificationTokenExpiry: {
        type: Sequelize.DATE,
      },
      resetPasswordToken: {
        type: Sequelize.STRING(300),
      },
      resetPasswordTokenExpiry: {
        type: Sequelize.DATE,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable("Trees", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      latitude: {
        type: Sequelize.DOUBLE(15, 12),
        allowNull: false,
      },
      longitude: {
        type: Sequelize.DOUBLE(15, 12),
        allowNull: false,
      },
      zip: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      lastWateredDate: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable("UserTrees", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: "Users",
          },
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        allowNull: false,
      },
      treeId: {
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: "Trees",
          },
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        allowNull: false,
      },
      treeNickname: Sequelize.STRING,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable("Notifications", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: {
            tableName: "Users",
          },
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        allowNull: false,
      },
      category: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      header: {
        type: Sequelize.TEXT,
      },
      message: {
        type: Sequelize.TEXT,
      },
      seen: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      sentAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down() {},
};
