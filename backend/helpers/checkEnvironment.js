function existEnvironmentVariables() {
  let allDefined = true;

  if (!process.env.JWT_KEY) {
    notDefinedError("JWT_KEY");
    allDefined = false;
  }

  if (!process.env.BASE_DOMAIN) {
    notDefinedError("BASE_DOMAIN");
    allDefined = false;
  }

  if (!process.env.TREE_DATA_VERSION) {
    notDefinedError("TREE_DATA_VERSION");
    allDefined = false;
  }

  if (!process.env.CORS_ORIGIN) {
    notDefinedError("CORS_ORIGIN");
    allDefined = false;
  }

  if (!process.env.NODEMAILER_EMAIL_ADDRESS) {
    notDefinedError("NODEMAILER_EMAIL_ADDRESS");
    allDefined = false;
  }

  if (!process.env.NODEMAILER_CLIENT_ID) {
    notDefinedError("NODEMAILER_CLIENT_ID");
    allDefined = false;
  }

  if (!process.env.NODEMAILER_REFRESH_TOKEN) {
    notDefinedError("NODEMAILER_REFRESH_TOKEN");
    allDefined = false;
  }

  if (!process.env.NODEMAILER_ACCESS_TOKEN) {
    notDefinedError("NODEMAILER_ACCESS_TOKEN");
    allDefined = false;
  }

  if (!process.env.NODEMAILER_EXPIRES_IN) {
    notDefinedError("NODEMAILER_EXPIRES_IN");
    allDefined = false;
  }

  if (!process.env.NODEMAILER_CLIENT_SECRET) {
    notDefinedError("NODEMAILER_CLIENT_SECRET");
    allDefined = false;
  }

  if (!process.env.FRONTEND_GOOGLE_LOGIN_CLIENT_ID) {
    notDefinedError("FRONTEND_GOOGLE_LOGIN_CLIENT_ID");
    allDefined = false;
  }

  if (!process.env.NODEMAILER_CLIENT_SECRET) {
    notDefinedError("FRONTEND_GOOGLE_LOGIN_CLIENT_SECRET");
    allDefined = false;
  }

  return allDefined;
}

function notDefinedError(variable) {
  console.error(">> Not defined environment variable: " + variable);
}

module.exports = {
  existEnvironmentVariables,
};
