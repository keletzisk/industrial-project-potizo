const {
  TREE_WITH_REQUESTED_ZIP_CODE_NOT_FOUND,
} = require("../../util/language");

class TreeZipCodeNotFoundError extends Error {
  constructor() {
    super(TREE_WITH_REQUESTED_ZIP_CODE_NOT_FOUND);
  }
}

module.exports = TreeZipCodeNotFoundError;
