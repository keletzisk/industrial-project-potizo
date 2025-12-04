const { THIS_USER_EXISTS } = require("../../util/language");

class UserAlreadyExistsError extends Error {
  constructor() {
    super(THIS_USER_EXISTS);
  }
}

module.exports = UserAlreadyExistsError;
