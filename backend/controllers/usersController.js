const crypto = require("node:crypto");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/errors/httpError");
const UserRepo = require("../repositories/userRepository");
const NotificationsRepo = require("../repositories/notificationsRepository");
const {
  sendEmailVerification,
  sendPasswordReset,
} = require("../helpers/emailHelper");
const UserAlreadyExistsError = require("../models/errors/userAlreadyExistsError");
const UserNotFoundError = require("../models/errors/userNotFoundError");
const UserNotVerifiedError = require("../models/errors/userNotVerifiedError");
const UserBlockedError = require("../models/errors/userBlockedError");
const UserSSOLoginError = require("../models/errors/userSsoLoginError");
const VerificationCodeInvalidError = require("../models/errors/verificationCodeInvalidError");
const VerificationCodeExpiredError = require("../models/errors/verificationCodeExpiredError");
const UserAlreadyVerifiedError = require("../models/errors/userAlreadyVerifiedError");
const InvalidPasswordError = require("../models/errors/invalidPasswordError");
const UserPendingVerificationError = require("../models/errors/userPendingVerificationError");
const { authorizeWithGoogleOAuth } = require("../helpers/util");

const JWT_EXPIRES_IN = 60 * 60;

async function signup(request, response, next) {
  const userEmail = request.body.email;
  const userPassword = request.body.password;
  const verificationCode = crypto.randomBytes(64).toString("hex");

  try {
    const user = await UserRepo.signup(
      userEmail,
      userPassword,
      verificationCode
    );
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        isLinkedAccount: !!user.googleId,
      },
      process.env.JWT_KEY,
      { expiresIn: JWT_EXPIRES_IN }
    );

    sendEmailVerification(userEmail, verificationCode);
    response.status(200).json({
      token,
    });
  } catch (error) {
    if (
      error instanceof UserAlreadyExistsError ||
      error instanceof UserPendingVerificationError ||
      error instanceof UserSSOLoginError
    ) {
      return next(new HttpError(error.message, 400));
    }
    return next(error);
  }
}

async function login(request, response, next) {
  const userEmail = request.body.email;
  const userPassword = request.body.password;

  try {
    const user = await UserRepo.login(userEmail, userPassword);
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        isLinkedAccount: !!user.googleId,
      },
      process.env.JWT_KEY,
      { expiresIn: JWT_EXPIRES_IN }
    );
    response.status(200).json({
      token,
    });
  } catch (error) {
    if (
      error instanceof UserNotFoundError ||
      error instanceof UserNotVerifiedError ||
      error instanceof UserBlockedError ||
      error instanceof InvalidPasswordError ||
      error instanceof UserSSOLoginError
    ) {
      return next(new HttpError(error.message, 400));
    }
    return next(error);
  }
}

async function verifyEmail(request, response, next) {
  const token = request.body.token;
  try {
    const user = await UserRepo.verifyEmailOfUser(token);
    const jwtToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        isLinkedAccount: !!user.googleId,
      },
      process.env.JWT_KEY,
      { expiresIn: JWT_EXPIRES_IN }
    );
    response.status(200).json({ token: jwtToken });
  } catch (error) {
    if (error instanceof VerificationCodeExpiredError)
      return next(new HttpError(error.message, 404));

    if (error instanceof VerificationCodeInvalidError)
      return next(new HttpError(error.message, 400));

    if (error instanceof UserAlreadyVerifiedError)
      return next(new HttpError(error.message, 403));

    return next(error);
  }
}

async function requestResetPassword(request, response, next) {
  const email = request.body.email;
  const resetPasswordCode = crypto.randomBytes(64).toString("hex");

  try {
    await UserRepo.initiateResetPassword(email, resetPasswordCode);
    sendPasswordReset(email, resetPasswordCode);
    response.status(200).send();
  } catch (error) {
    if (error instanceof UserNotFoundError)
      return next(new HttpError(error.message, 404));
    if (error instanceof UserSSOLoginError)
      return next(new HttpError(error.message, 403));

    return next(error);
  }
}

async function finishResetPassword(request, response, next) {
  const newPassword = request.body.newPassword;
  const resetPasswordToken = request.body.resetPasswordToken;

  try {
    const user = await UserRepo.finishResetPassword(
      resetPasswordToken,
      newPassword
    );
    const jwtToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        isLinkedAccount: !!user.googleId,
      },
      process.env.JWT_KEY,
      { expiresIn: JWT_EXPIRES_IN }
    );
    response.status(200).json({ token: jwtToken });
  } catch (error) {
    if (
      error instanceof VerificationCodeInvalidError ||
      error instanceof UserNotVerifiedError ||
      error instanceof VerificationCodeExpiredError
    )
      return next(new HttpError(error.message, 404));

    return next(error);
  }
}

async function deleteAccount(request, response, next) {
  const userId = request.jwtUserId;

  try {
    await UserRepo.deleteAccount(userId);
    response.status(200).send();
  } catch (error) {
    return next(error);
  }
}

async function getNotSeenNotifications(request, response, next) {
  try {
    const userId = request.jwtUserId;
    const notifications = await NotificationsRepo.getNotSeenNotifications(
      userId
    );

    response.status(200).json({ data: notifications });
  } catch (error) {
    return next(error);
  }
}

async function setAllNotificationsToSeen(request, response, next) {
  try {
    const userId = request.jwtUserId;
    await NotificationsRepo.setAllNotificationsToSeen(userId);

    response.status(204).send();
  } catch (error) {
    return next(error);
  }
}

async function googleLogin(request, response, next) {
  try {
    const { code } = request.body;

    const { id, email } = await authorizeWithGoogleOAuth(code);

    let user = await UserRepo.loginByGoogle(id);

    if (!user) user = await UserRepo.signupByGoogle(email, id);

    const responseToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        isLinkedAccount: !!user.googleId,
      },
      process.env.JWT_KEY,
      { expiresIn: JWT_EXPIRES_IN }
    );

    response.status(200).json({ token: responseToken });
  } catch (error) {
    if (
      error instanceof UserBlockedError ||
      error instanceof UserAlreadyExistsError
    )
      return next(new HttpError(error.message, 400));
    return next(error);
  }
}

module.exports = {
  signup,
  login,
  requestResetPassword,
  finishResetPassword,
  deleteAccount,
  verifyEmail,
  getNotSeenNotifications,
  setAllNotificationsToSeen,
  googleLogin,
};
