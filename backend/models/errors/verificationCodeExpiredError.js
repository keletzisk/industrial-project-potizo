const { VERIFICATION_CODE_EXPIRED } = require("../../util/language");

class VerificationCodeExpiredError extends Error {
  constructor() {
    super(VERIFICATION_CODE_EXPIRED);
  }
}

module.exports = VerificationCodeExpiredError;
