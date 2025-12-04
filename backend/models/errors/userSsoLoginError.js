const { USER_HAS_SIGNED_UP_WITH_SOCIAL } = require("../../util/language");

class UserSSOLoginError extends Error {
  constructor() {
    super(USER_HAS_SIGNED_UP_WITH_SOCIAL);
  }
}

module.exports = UserSSOLoginError;
