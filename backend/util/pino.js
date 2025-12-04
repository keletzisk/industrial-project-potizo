const pino = require("pino");
const { isProduction } = require("./environment");

const pinoPrettytransport = pino.transport({
  target: "pino-pretty",
  options: {
    translateTime: false,
    ignore:
      "pid,hostname,req.headers,req.remoteAddress,req.remotePort,res.headers",
  },
});

const pinoProductionTransport = pino.transport({
  targets: [
    {
      target: "pino/file",
      level: "error",
      options: { destination: process.cwd() + "/logs/pino.log", mkdir: true },
    },
    {
      target: "./pinoWriteStream.js",
    },
  ],
});

const pinoOptions = {
  timestamp: pino.stdTimeFunctions.isoTime,
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
  customSuccessMessage: function (request, response) {
    if (response.statusCode === 404) {
      return "resource not found";
    }
    return `${request.method} completed`;
  },
  customReceivedMessage: function (request, _response) {
    return "request received: " + request.method;
  },
  customErrorMessage: function (request, response, _error) {
    return "request errored with status code: " + response.statusCode;
  },
};

const logger = isProduction()
  ? pino({ ...pinoOptions }, pinoProductionTransport)
  : pino({ ...pinoOptions, level: "debug" }, pinoPrettytransport);

module.exports = logger;
