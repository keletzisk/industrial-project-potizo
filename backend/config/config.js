const { isDevelopment } = require("../util/environment");
const logger = require("../util/pino");

module.exports = {
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "mot-trees-root",
  database: process.env.DB_NAME || "mot_trees",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  dialect: "mysql",
  pool: {
    max: 4,
    min: 0,
    acquire: 30_000,
    idle: 10_000,
  },
  logging: isDevelopment()
    ? (sql, timing) =>
        logger.info(
          sql,
          typeof timing === "number" ? `Elapsed time: ${timing}ms` : ""
        )
    : false,
};
