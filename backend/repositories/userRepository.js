const database = require("../models/db");
const bcrypt = require("bcryptjs");
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
const { add } = require("date-fns");
const { Op } = require("sequelize");

const User = database.User;

const EMAIL_ACTION_WAIT_TIME_MINUTES = 30;

const UserRepo = {
  async signup(email, password, verificationCode) {
    const user = await UserRepo.findUserByEmail(email);

    if (user) {
      if (user.googleId) throw new UserSSOLoginError();
      if (!user.isVerified) throw new UserPendingVerificationError();
      throw new UserAlreadyExistsError();
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    return await User.create({
      email,
      password: hashedPassword,
      isBlocked: 0,
      isVerified: 0,
      verificationCode,
      verificationTokenExpiry: add(new Date(), {
        minutes: EMAIL_ACTION_WAIT_TIME_MINUTES,
      }),
    });
  },

  async login(email, password) {
    const user = await User.findOne({
      where: { email },
    });

    if (!user) throw new UserNotFoundError();
    if (user.googleId) throw new UserSSOLoginError();
    if (!user.isVerified) throw new UserNotVerifiedError();
    if (user.isBlocked) throw new UserBlockedError();
    if (!(await bcrypt.compare(password, user.password)))
      throw new InvalidPasswordError();

    return user;
  },

  async findUserByEmail(email) {
    return User.findOne({
      where: {
        email,
      },
    });
  },

  async findUserByVericationToken(token) {
    return User.findOne({
      where: {
        verificationCode: token,
      },
    });
  },

  async findUserByResetPasswordToken(token) {
    return User.findOne({
      where: {
        resetPasswordToken: token,
      },
    });
  },

  async verifyEmailOfUser(token) {
    const user = await UserRepo.findUserByVericationToken(token);

    if (!user) throw new VerificationCodeInvalidError();
    if (user.isVerified) throw new UserAlreadyVerifiedError();
    if (Date.parse(user.verificationTokenExpiry) < Date.now())
      throw new VerificationCodeExpiredError();

    return await user.update({
      isVerified: true,
      // verificationCode: null,
      verificationTokenExpiry: null,
    });
  },

  async deleteAccount(userId) {
    const user = await this.getUserById(userId);
    if (!user) throw new UserNotFoundError();
    await User.destroy({
      where: {
        id: userId,
      },
    });
  },

  async getUserById(userId) {
    return await User.findByPk(userId);
  },

  async loginByGoogle(googleId) {
    const existingUser = await User.findOne({
      where: { googleId },
    });

    if (existingUser?.isBlocked) throw new UserBlockedError();
    return existingUser;
  },

  async signupByGoogle(email, googleId) {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) throw new UserAlreadyExistsError();

    const hashedPassword = await bcrypt.hash(googleId, 12);
    const createdUser = await User.create({
      email,
      password: hashedPassword,
      isBlocked: false,
      isVerified: true,
      verificationCode: "GOOGLE",
      googleId,
    });

    await createdUser.save();
    return createdUser;
  },

  async initiateResetPassword(email, resetPasswordCode) {
    const user = await this.findUserByEmail(email);
    if (!user) throw new UserNotFoundError();
    if (user.googleId) throw new UserSSOLoginError();

    return user.update({
      resetPasswordToken: resetPasswordCode,
      resetPasswordTokenExpiry: add(new Date(), {
        minutes: EMAIL_ACTION_WAIT_TIME_MINUTES,
      }),
    });
  },

  async finishResetPassword(resetPasswordToken, newPassword) {
    const user = await UserRepo.findUserByResetPasswordToken(
      resetPasswordToken
    );

    if (!user) throw new VerificationCodeInvalidError();
    if (!user.isVerified) throw new UserNotVerifiedError();
    if (Date.parse(user.resetPasswordTokenExpiry) < Date.now())
      throw new VerificationCodeExpiredError();

    const newHashedPassword = await bcrypt.hash(newPassword, 12);
    return await user.update({ password: newHashedPassword });
  },

  async getUserEmailById(userId) {
    return await User.findOne({
      where: { id: userId },
      attributes: ["id", "email"],
    });
  },

  async deleteUnverifiedUsers() {
    return await User.destroy({
      where: {
        isVerified: false,
        verificationTokenExpiry: {
          [Op.lt]: new Date(),
        },
      },
    });
  },
};

module.exports = UserRepo;
