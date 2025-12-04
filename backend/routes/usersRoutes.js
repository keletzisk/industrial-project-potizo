const express = require("express");
const { body } = require("express-validator");
const usersController = require("../controllers/usersController");

const usersRouter = express.Router();
const verifyToken = require("../middlewares/authJwt");
const inputValidation = require("../middlewares/inputValidation");

/**
 * Open routes
 */
usersRouter.post(
  "/reset-password",
  [body("email").normalizeEmail().isEmail()],
  inputValidation,
  usersController.requestResetPassword
);
usersRouter.post(
  "/reset-password/finish",
  [
    body("resetPasswordToken").isString(),
    body("newPassword").isLength({ min: 8 }),
  ],
  inputValidation,
  usersController.finishResetPassword
);
usersRouter.post(
  "/signup",
  [
    body("email").normalizeEmail().isEmail(),
    body("password").isLength({ min: 8 }),
  ],
  inputValidation,
  usersController.signup
);
usersRouter.post(
  "/login",
  [
    body("email").normalizeEmail().isEmail(),
    body("password").isLength({ min: 8 }),
  ],
  inputValidation,
  usersController.login
);
usersRouter.post(
  "/verify-email",
  [body("token").isString()],
  inputValidation,
  usersController.verifyEmail
);
usersRouter.post(
  "/google-login",
  [body("code").isString()],
  inputValidation,
  usersController.googleLogin
);

/**
 * Authorized routes
 */
usersRouter.use(verifyToken);

usersRouter.delete("/delete", usersController.deleteAccount);
usersRouter.get(
  "/notifications/not-seen",
  usersController.getNotSeenNotifications
);
usersRouter.patch(
  "/notification/see",
  usersController.setAllNotificationsToSeen
);

module.exports = usersRouter;
