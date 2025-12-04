"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { parse } = require("csv-parse");
const async = require("async");

async function parseTreeCSV(databaseBulkInsert) {
  return new Promise((resolve, reject) => {
    const input = fs.createReadStream(path.join(__dirname, "data", "tree.csv"));
    const records = [];
    const parser = parse({ from_line: 2 });

    const inserter = async.cargo(function (tasks, inserterCallback) {
      return databaseBulkInsert(tasks).then(inserterCallback);
    }, 1000);

    parser.on("error", function (error) {
      console.error(error.message);
      reject(error);
    });

    parser.on("readable", () => {
      let line;
      while ((line = parser.read())) {
        inserter.push({
          id: Number(line[0]),
          name: line[1],
          type: line[2],
          address: line[3],
          latitude: Number(line[4]),
          longitude: Number(line[5]),
          zip: line[6],
          createdAt: line[7],
        });
      }
    });

    parser.on("end", () => {
      inserter.drain(function () {
        resolve(records);
      });
    });

    input.pipe(parser);
  });
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    await parseTreeCSV((records) =>
      queryInterface.bulkInsert("Trees", records)
    );
  },

  async down() {},
};
