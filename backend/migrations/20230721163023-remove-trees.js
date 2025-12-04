"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    queryInterface.bulkDelete("Trees", {
      id: [50_162, 50_163, 50_164, 50_165, 50_166, 50_167, 50_168],
    });
  },

  async down(_queryInterface, _Sequelize) {},
};
