const { USER_PENDING_VERIFICATION } = require("../../util/language");

class UserPendingVerificationError extends Error {
  constructor() {
    super(USER_PENDING_VERIFICATION);
  }
}

module.exports = UserPendingVerificationError;
