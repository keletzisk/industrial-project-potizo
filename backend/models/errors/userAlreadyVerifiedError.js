const { USER_ALREADY_VERIFIED } = require("../../util/language");

class UserAlreadyVerifiedError extends Error {
  constructor() {
    super(USER_ALREADY_VERIFIED);
  }
}

module.exports = UserAlreadyVerifiedError;
