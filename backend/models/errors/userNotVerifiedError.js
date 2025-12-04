const { USER_NOT_VERIFIED } = require("../../util/language");

class UserNotVerifiedError extends Error {
  constructor() {
    super(USER_NOT_VERIFIED);
  }
}

module.exports = UserNotVerifiedError;
