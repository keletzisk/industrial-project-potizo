const nodemailer = require("nodemailer");
const logger = require("../util/pino");

const transporter = nodemailer.createTransport({
  service: `${process.env.NODEMAILER_SERVICE}`,
  auth: {
    type: "OAuth2",
    user: `${process.env.NODEMAILER_EMAIL_ADDRESS}`,
    clientId: `${process.env.NODEMAILER_CLIENT_ID}`,
    clientSecret: `${process.env.NODEMAILER_CLIENT_SECRET}`,
    refreshToken: `${process.env.NODEMAILER_REFRESH_TOKEN}`,
    accessToken: `${process.env.NODEMAILER_ACCESS_TOKEN}`,
    expires: `${process.env.NODEMAILER_EXPIRES_IN}`,
  },
});

function sendEmail(to, subject, htmlContent) {
  console.log("REAL sendEmail", to, subject);
  const mailOptions = {
    from: {
      address: process.env.NODEMAILER_EMAIL_ADDRESS,
      name: "ΠοτίΖω",
    },
    to: to,
    subject: subject,
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, function (error, _info) {
    if (error) {
      logger.error(error);
    }
  });
}

module.exports = {
  sendEmail,
};
