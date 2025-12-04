const request = require("supertest");

// ROUTES
const users_api = "/api/users/";
const trees_api = "/api/trees/";

class ApiWrapper {
  authorizationToken;

  constructor(app) {
    this.app = app;
  }

  login = async function (email, password) {
    return await request(this.app)
      .post(users_api + "/login")
      .send({ email: email, password: password });
  };

  googleLogin = async function (code) {
    return await request(this.app)
      .post(users_api + "/google-login")
      .send({ code: code });
  };

  signUp = async function (email, password) {
    return await request(this.app)
      .post(users_api + "/signup")
      .send({ email: email, password: password });
  };

  verifyUser = async function (verificationCode) {
    return await request(this.app)
      .post(users_api + "/verify-email")
      .send({ token: verificationCode });
  };

  async resetPassword(email) {
    return await request(this.app)
      .post(users_api + "/reset-password")
      .send({ email: email });
  }

  deleteAccount = async function () {
    return await request(this.app)
      .delete(users_api + "/delete")
      .set("Authorization", "JWT " + this.authorizationToken);
  };

  getUnseenNotifications = async function () {
    return await request(this.app)
      .get(users_api + "/notifications/not-seen")
      .set("Authorization", "JWT " + this.authorizationToken);
  };

  setAllNotificationsToSeen = async function () {
    return await request(this.app)
      .patch(users_api + "/notification/see")
      .set("Authorization", "JWT " + this.authorizationToken);
  };

  resetPasswordFinish = async function (resetPasswordToken, newPassword) {
    return await request(this.app)
      .post(users_api + "/reset-password/finish")
      .send({
        resetPasswordToken: resetPasswordToken,
        newPassword: newPassword,
      });
  };

  trees = async function () {
    return await request(this.app)
      .get(trees_api)
      .set("Authorization", "JWT " + this.authorizationToken);
  };

  getUserTrees = async function () {
    return await request(this.app)
      .get(trees_api + "/user")
      .set("Authorization", "JWT " + this.authorizationToken);
  };

  getUserData = async function () {
    return await request(this.app)
      .get(trees_api + "/getUserData")
      .set("Authorization", "JWT " + this.authorizationToken);
  };

  getTreeByZip = async function (zipCode) {
    return await request(this.app)
      .get(trees_api + "/getTreeByZip/" + zipCode)
      .set("Authorization", "JWT " + this.authorizationToken);
  };

  adopt = async function (treeId) {
    return await request(this.app)
      .patch(trees_api + treeId + "/adopt")
      .set("Authorization", "JWT " + this.authorizationToken);
  };

  abandon = async function (treeId) {
    return await request(this.app)
      .patch(trees_api + treeId + "/abandon")
      .set("Authorization", "JWT " + this.authorizationToken);
  };

  rename = async function (treeId, newName) {
    return await request(this.app)
      .patch(trees_api + treeId + "/rename")
      .set("Authorization", "JWT " + this.authorizationToken)
      .send({ name: newName });
  };

  waterTree = async function (treeId) {
    return await request(this.app)
      .patch(trees_api + treeId + "/water")
      .set("Authorization", "JWT " + this.authorizationToken);
  };

  treeNickname = async function (treeId) {
    return await request(this.app)
      .get(trees_api + treeId + "/treenickname")
      .set("Authorization", "JWT " + this.authorizationToken);
  };

  getTreeInfo = async function (treeId) {
    return await request(this.app)
      .get(trees_api + treeId + "/getTreeInfo")
      .set("Authorization", "JWT " + this.authorizationToken);
  };

  /**
   * Does not use JWT
   */
  sendUnwateredNotifications = async function () {
    return await request(this.app)
      .get("/api/test/send-unwatered-notifications")
      .set("Authorization", process.env.TEST_AUTH_TOKEN);
  };

  statistics = async function () {
    return await request(this.app)
      .get("/api/test/statistics")
      .set("Authorization", process.env.TEST_AUTH_TOKEN);
  };
}

const logResponse = function (response) {
  console.log("Status:", response.statusCode);
  console.log("Text:", response.text);
  console.log("Body:", JSON.stringify(response.body));
};

module.exports = {
  ApiWrapper,
  logResponse,
};
