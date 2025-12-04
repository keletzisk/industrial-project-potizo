const { VERIFICATION_CODE_INVALID } = require("../../util/language");

class VerificationCodeInvalidError extends Error {
  constructor() {
    super(VERIFICATION_CODE_INVALID);
  }
}

module.exports = VerificationCodeInvalidError;
