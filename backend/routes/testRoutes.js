const express = require("express");
const { body } = require("express-validator");
const inputValidation = require("../middlewares/inputValidation");
const {
  sendEmail,
  sendUnwateredNotificationEmails,
  statistics,
} = require("../controllers/testController");

const testRouter = express.Router();

testRouter.use((request, response, next) => {
  const token = request.headers.authorization;
  const storedToken = process.env.TEST_AUTH_TOKEN;

  if (token !== storedToken) {
    return response.status(401).json({ error: "Unauthorized" });
  }

  next();
});

testRouter.post(
  "/send-email",
  body("email").normalizeEmail().isEmail(),
  inputValidation,
  sendEmail
);

testRouter.get(
  "/send-unwatered-notifications",
  sendUnwateredNotificationEmails
);

testRouter.get("/statistics", statistics);

module.exports = testRouter;
