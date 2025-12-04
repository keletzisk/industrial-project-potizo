require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");
const cors = require("cors");
const bodyParser = require("body-parser");
require("./models/db");
const express = require("express");
const logger = require("./util/pino");
const { pinoHttpLogging } = require("./util/pinoHttp");
const { isProduction, isCI } = require("./util/environment");
const Sentry = require("@sentry/node");
const { cronJobsStart } = require("./util/cronjobs");

const treesRoutes = require("./routes/treesRoutes");
const usersRoutes = require("./routes/usersRoutes");
const testRoutes = require("./routes/testRoutes");
const HttpError = require("./models/errors/httpError");
const { apiLimiter } = require("./middlewares/apiLimiter");
const { existEnvironmentVariables } = require("./helpers/checkEnvironment");

if (!existEnvironmentVariables()) {
  console.error("\n>>>> Undefined environment variables!\n");
}

const app = express();

if (isProduction() && process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    version: false,
    serverName: false,
  });
  app.use(Sentry.Handlers.requestHandler());
}

app.set("trust proxy", process.env.SLOW_DOWN_REVERSE_PROXY_COUNT || 1); // Bypass the NGING proxy to get the real IP for rate limiting

app.use(bodyParser.json());
app.use(express.static(path.join("public")));

// Allow cross origin based on ENV
const corsOptions = {
  origin: `${process.env.CORS_ORIGIN}`,
};

app.use(cors(corsOptions));

const apiRouter = express.Router();

if (isCI()) {
  console.log("No logging");
} else {
  apiRouter.use(pinoHttpLogging);
}

apiRouter.use("/trees", treesRoutes);
apiRouter.use("/users", usersRoutes);
apiRouter.use("/test", testRoutes);
apiRouter.use("*", (request, response) => response.sendStatus(404));

if (isProduction()) {
  console.log(process.env.NODE_ENV, "API Limiting");
  app.use("/api/", apiLimiter);
} else {
  console.log(process.env.NODE_ENV, "NO API Limiting");
}

app.use("/api", apiRouter);

app.use((request, response) => {
  response.sendFile(path.resolve(__dirname, "public", "index.html"));
});

if (isProduction() && process.env.SENTRY_DSN) {
  // The error handler must be before any other error middleware and after all controllers
  app.use(
    Sentry.Handlers.errorHandler({
      shouldHandleError(error) {
        return !(error instanceof HttpError);
      },
    })
  );
}

app.use((error, request, response, _next) => {
  if (request.file) {
    fs.unlink(request.file.path, (error_) => {
      logger.info(error_);
    });
  }

  response.err = error;
  response.status(error.errorCode || 500).json({
    message: error.message || "Internal Server Error",
    sentryId: response.sentry,
  });
});

cronJobsStart();

const port = process.env.PORT || 5000;

console.log("Starting server on port", port);

// export for testing
module.exports = app.listen(port);
