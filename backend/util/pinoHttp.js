const logger = require("./pino");
const pinoHttp = require("pino-http");
const { randomUUID } = require("node:crypto");

const pinoHttpLogging = pinoHttp({
  logger,
  genReqId: function (request, response) {
    const existingID = request.id ?? request.headers["x-request-id"];
    if (existingID) return existingID;
    const id = randomUUID();
    response.setHeader("X-Request-Id", id);
    return id;
  },
  customLogLevel: function (request, response, error) {
    if (response.statusCode >= 400 && response.statusCode < 500) {
      return "warn";
    } else if (response.statusCode >= 500 || error) {
      return "error";
    } else if (response.statusCode >= 300 && response.statusCode < 400) {
      return "silent";
    }
    return "info";
  },
  customReceivedMessage: function (request, _response) {
    return "request received: " + request.method;
  },
  customSuccessMessage: function (request, response) {
    if (response.statusCode === 404) {
      return "resource not found";
    }
    return `${request.method} completed`;
  },
  customErrorMessage: function (request, response, _error) {
    return "request errored with status code: " + response.statusCode;
  },
});

module.exports = {
  pinoHttpLogging,
};
