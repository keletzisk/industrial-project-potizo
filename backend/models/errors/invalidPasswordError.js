const { INVALID_PASSWORD } = require("../../util/language");

class InvalidPasswordError extends Error {
  constructor() {
    super(INVALID_PASSWORD);
  }
}

module.exports = InvalidPasswordError;
