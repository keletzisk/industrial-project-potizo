class HttpError extends Error {
  errorCode;

  constructor(message, errorCode) {
    super(message);
    this.errorCode = errorCode;
  }
}

module.exports = HttpError;
