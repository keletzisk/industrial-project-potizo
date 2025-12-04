const { USER_NOT_EXISTS } = require("../../util/language");

class UserNotFoundError extends Error {
  constructor() {
    super(USER_NOT_EXISTS);
  }
}

module.exports = UserNotFoundError;
