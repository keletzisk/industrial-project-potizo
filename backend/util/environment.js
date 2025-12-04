function isProduction() {
  return process.env.NODE_ENV === "production";
}

function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

function isTesting() {
  return process.env.NODE_ENV === "testing";
}

function isCI() {
  return process.env.CI !== undefined;
}

module.exports = {
  isProduction,
  isDevelopment,
  isTesting,
  isCI,
};
