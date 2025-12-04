const fs = require("node:fs");

function logToFile(message) {
  fs.appendFileSync("logs.txt", `${new Date().toString()}: ${message}\n`);
}

module.exports = logToFile;
