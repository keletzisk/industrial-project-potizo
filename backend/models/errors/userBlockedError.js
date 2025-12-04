const { USER_BLOCKED } = require("../../util/language");

class UserBlockedError extends Error {
  constructor() {
    super(USER_BLOCKED);
  }
}

module.exports = UserBlockedError;
