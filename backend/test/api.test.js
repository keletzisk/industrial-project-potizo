require("./hooks");

const { describe, it, after, before, beforeEach, afterEach } = require("mocha");
const request = require("supertest");
const { expect } = require("expect");
const sinon = require("sinon");
const { add } = require("date-fns");

// Mock send email and google auth
const emailer = require("../helpers/emailer");
const sendEmailStub = sinon.stub(emailer, "sendEmail");

const util = require("../helpers/util");
const authorizeWithGoogleOAuthStub = sinon.stub(
  util,
  "authorizeWithGoogleOAuth"
);

const cronjobs = require("../util/cronjobs");
// STUB the cronJobsStart function
cronjobs.cronJobsStart = function () {};

const greekTranslations = require("../util/language");
const { DBFixture, comparePasswords } = require("./freshDatabase");
const {
  createUniqueString,
  createUser,
  createTree,
  createGoogleUser,
  createNotVerifiedUser,
  createResetPwdUser,
  createUserWithAdoptedTree,
  createNotification,
  createUsersWithAdoptedTrees,
} = require("./factory");
const { ApiWrapper } = require("./testUtilityMethods");

describe("Testing API endpoints", function () {
  this.timeout(0);
  let app = null;
  /** @type ApiWrapper */
  let api = null;
  let databaseFixture = null;

  before(function () {
    app = require("../app");
  });

  const getTokenOfLoggedInUser = async function (loggedInUser) {
    const response = await api.login(loggedInUser.email, loggedInUser.password);
    expect(response.statusCode).toBe(200);
    return response.body.token;
  };

  beforeEach(async function () {
    api = new ApiWrapper(app);
    databaseFixture = new DBFixture();
  });

  afterEach(async function () {
    // reset the behaviour and history of the stub.
    sendEmailStub.reset();
    sinon.restore();
  });

  after(async function () {
    await app.close();
  });

  describe("api unknown, unauthorized", function () {
    it("outside users and trees 404", async function () {
      const response = await request(app).get("/api/login");

      expect(response.statusCode).toBe(404);
    });

    it("no JWT", async function () {
      const response = await request(app).get("/api/users/delete");

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toEqual(
        greekTranslations.AUTHORIZATION_PROBLEM
      );
    });
  });

  describe("users API /api/users/", function () {
    describe("email-login", function () {
      it("successful login", async function () {
        const user = createUser(1);
        await databaseFixture.populate({ users: [user] });

        const response = await api.login(user.email, user.password);

        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeTruthy();
      });

      it("not existing user", async function () {
        const user = createUser(1);
        await databaseFixture.populate({ users: [] });

        const response = await api.login(user.email, user.password);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          greekTranslations.USER_NOT_EXISTS
        );
      });

      it("wrong password 400 INVALID_PASSWORD", async function () {
        const user = createUser(1);
        await databaseFixture.populate({ users: [user] });

        const response = await api.login(user.email, user.password + "x");

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          greekTranslations.INVALID_PASSWORD
        );
      });

      it("user has social account 400 USER_HAS_SIGNED_UP_WITH_SOCIAL", async function () {
        const googleUser = createGoogleUser(1);
        await databaseFixture.populate({ users: [googleUser] });

        const response = await api.login(googleUser.email, googleUser.password);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          greekTranslations.USER_HAS_SIGNED_UP_WITH_SOCIAL
        );
      });

      it("no email no password 422 VALIDATION_FAILED", async function () {
        await databaseFixture.populate({ users: [] });

        const response = await api.login();

        expect(response.statusCode).toBe(422);
        expect(response.body.message).toEqual(
          greekTranslations.VALIDATION_FAILED
        );
      });

      it("login of not verified 400 USER_NOT_VERIFIED", async function () {
        const notVerifiedUser = createNotVerifiedUser(1, 30);
        await databaseFixture.populate({ users: [notVerifiedUser] });

        const response = await api.login(
          notVerifiedUser.email,
          notVerifiedUser.password
        );

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          greekTranslations.USER_NOT_VERIFIED
        );
      });
    });

    describe("google-login", function () {
      it("with invalid code 500", async function () {
        await databaseFixture.populate({ users: [] });
        // STUB
        authorizeWithGoogleOAuthStub.throws();

        const response = await api.googleLogin(createUniqueString());

        expect(response.statusCode).toBe(500);
      });

      it("with valid code registers and logs in", async function () {
        const googleUser = createGoogleUser(1);
        await databaseFixture.populate({ users: [] });
        // STUB
        const googleId = createUniqueString();
        authorizeWithGoogleOAuthStub.returns({
          id: googleId,
          email: googleUser.email,
        });

        const response = await api.googleLogin(createUniqueString());

        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeTruthy();
      });

      it("already signed up (not verified) user 400 THIS_USER_EXISTS", async function () {
        const notVerifiedUser = createNotVerifiedUser(1, 30);
        await databaseFixture.populate({ users: [notVerifiedUser] });
        // STUB
        authorizeWithGoogleOAuthStub.returns({
          id: createUniqueString(),
          email: notVerifiedUser.email,
        });

        const response = await api.googleLogin(createUniqueString());

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          greekTranslations.THIS_USER_EXISTS
        );
      });

      it("already verified user 400 THIS_USER_EXISTS", async function () {
        const otherUser = createUser(1);
        await databaseFixture.populate({ users: [otherUser] });
        // STUB
        authorizeWithGoogleOAuthStub.returns({
          id: createUniqueString(),
          email: otherUser.email,
        });

        const response = await api.googleLogin(createUniqueString());

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          greekTranslations.THIS_USER_EXISTS
        );
      });
    });

    describe("sign-up", function () {
      it("successful sign-up", async function () {
        const newUserSigningIn = createUser(1);
        await databaseFixture.populate({ users: [] });

        const response = await api.signUp(
          newUserSigningIn.email,
          newUserSigningIn.password
        );

        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeTruthy();
        sinon.assert.calledOnce(sendEmailStub);
        const emailArguments = sendEmailStub.getCall(0).args;
        expect(emailArguments[0]).toEqual(newUserSigningIn.email);
        expect(emailArguments[1]).toEqual(
          greekTranslations.emailLanguage.verificationEmailSubject
        );
      });

      it("user with existing google login 400 USER_HAS_SIGNED_UP_WITH_SOCIAL", async function () {
        const googleUser = createGoogleUser(1);
        await databaseFixture.populate({ users: [googleUser] });

        const response = await api.signUp(
          googleUser.email,
          googleUser.password
        );

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          greekTranslations.USER_HAS_SIGNED_UP_WITH_SOCIAL
        );
        sinon.assert.notCalled(sendEmailStub);
      });

      it("already signed-up and verified 400 THIS_USER_EXISTS", async function () {
        const existingUser = createUser(1);
        await databaseFixture.populate({ users: [existingUser] });

        const response = await api.signUp(
          existingUser.email,
          existingUser.password
        );

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          greekTranslations.THIS_USER_EXISTS
        );
        sinon.assert.notCalled(sendEmailStub);
      });

      it("already signed up and not verified 400 USER_PENDING_VERIFICATION", async function () {
        const notVerifiedUser = createNotVerifiedUser(1, 30);
        await databaseFixture.populate({ users: [notVerifiedUser] });

        const response = await api.signUp(
          notVerifiedUser.email,
          notVerifiedUser.password
        );

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          greekTranslations.USER_PENDING_VERIFICATION
        );
        sinon.assert.notCalled(sendEmailStub);
      });
    });

    describe("verify account", function () {
      it("successful verify logins user", async function () {
        const notVerifiedUser = createNotVerifiedUser(1, 1);
        await databaseFixture.populate({ users: [notVerifiedUser] });

        const response = await api.verifyUser(notVerifiedUser.verificationCode);

        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeTruthy();
        const user = await databaseFixture.getUserByEmail(
          notVerifiedUser.email
        );
        expect(user.isVerified).toEqual(true);
      });

      it("verify late 404 VERIFICATION_CODE_EXPIRED", async function () {
        const notVerifiedUserLate = createNotVerifiedUser(1, -1);

        await databaseFixture.populate({ users: [notVerifiedUserLate] });

        const response = await api.verifyUser(
          notVerifiedUserLate.verificationCode
        );

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toEqual(
          greekTranslations.VERIFICATION_CODE_EXPIRED
        );
      });

      it("wrong token 400 VERIFICATION_CODE_INVALID", async function () {
        await databaseFixture.populate({ users: [] });

        const response = await api.verifyUser(createUniqueString());

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          greekTranslations.VERIFICATION_CODE_INVALID
        );
      });

      it("user already verified 403 USER_ALREADY_VERIFIED", async function () {
        const notVerifiedUser = createNotVerifiedUser(1, 30);
        await databaseFixture.populate({ users: [notVerifiedUser] });
        await api.verifyUser(notVerifiedUser.verificationCode);

        const response = await api.verifyUser(notVerifiedUser.verificationCode);

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toEqual(
          greekTranslations.USER_ALREADY_VERIFIED
        );
      });
    });

    describe("request reset password", function () {
      it("successful reset request", async function () {
        const otherUser = createUser(1);
        await databaseFixture.populate({ users: [otherUser] });

        const response = await api.resetPassword(otherUser.email);

        expect(response.statusCode).toBe(200);
        sinon.assert.calledOnce(sendEmailStub);
        const emailArguments = sendEmailStub.getCall(0).args;
        expect(emailArguments[0]).toEqual(otherUser.email);
        expect(emailArguments[1]).toEqual(
          greekTranslations.emailLanguage.resetPasswordEmailSubject
        );
      });

      it("not existing email 404 USER_NOT_EXISTS", async function () {
        const notExistingUser = createUser(1);
        await databaseFixture.populate({ users: [] });

        const response = await api.resetPassword(notExistingUser.email);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toEqual(
          greekTranslations.USER_NOT_EXISTS
        );
        sinon.assert.notCalled(sendEmailStub);
      });

      it("google user 403 USER_HAS_SIGNED_UP_WITH_SOCIAL", async function () {
        const googleUser = createGoogleUser(1);
        await databaseFixture.populate({ users: [googleUser] });

        const response = await api.resetPassword(googleUser.email);

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toEqual(
          greekTranslations.USER_HAS_SIGNED_UP_WITH_SOCIAL
        );
        sinon.assert.notCalled(sendEmailStub);
      });

      it("successful reset password finish logins user", async function () {
        const resetPwdUser = createResetPwdUser(1, 1);

        await databaseFixture.populate({ users: [resetPwdUser] });

        const newPassword = "newPassword";

        const response = await api.resetPasswordFinish(
          resetPwdUser.resetPasswordToken,
          newPassword
        );

        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeTruthy();
        const user = await databaseFixture.getUserByEmail(resetPwdUser.email);
        expect(await comparePasswords(newPassword, user.password)).toBe(true);
      });

      it("expired 404 VERIFICATION_CODE_EXPIRED", async function () {
        const resetPwdUser = createResetPwdUser(1, -1);
        await databaseFixture.populate({ users: [resetPwdUser] });
        const newPassword = "newPassword";

        const response = await api.resetPasswordFinish(
          resetPwdUser.resetPasswordToken,
          newPassword
        );

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toEqual(
          greekTranslations.VERIFICATION_CODE_EXPIRED
        );
      });

      it("random token 404 VERIFICATION_CODE_INVALID", async function () {
        const resetPwdUser = createResetPwdUser(1, 1);
        await databaseFixture.populate({ users: [resetPwdUser] });
        const newPassword = "newPassword";

        const response = await api.resetPasswordFinish(
          createUniqueString(),
          newPassword
        );

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toEqual(
          greekTranslations.VERIFICATION_CODE_INVALID
        );
      });

      it("short password", async function () {
        const resetPwdUser = createResetPwdUser(1, 1);
        await databaseFixture.populate({ users: [resetPwdUser] });

        const newPassword = "1234567";

        const response = await api.resetPasswordFinish(
          resetPwdUser.resetPasswordToken,
          newPassword
        );

        expect(response.statusCode).toBe(422);
        expect(response.body.message).toEqual(
          greekTranslations.VALIDATION_FAILED
        );
        const user = await databaseFixture.getUserByEmail(resetPwdUser.email);
        expect(
          await comparePasswords(resetPwdUser.password, user.password)
        ).toBe(true);
      });
    });

    describe("delete account", function () {
      it("successful delete", async function () {
        const user = createUser(1);
        await databaseFixture.populate({ users: [user] });
        api.authorizationToken = await getTokenOfLoggedInUser(user);

        const response = await api.deleteAccount();

        expect(response.statusCode).toBe(200);
        const deletedUser = await databaseFixture.getUserByEmail(user.email);
        expect(deletedUser).toBeFalsy();
      });
    });

    describe("notifications API", function () {
      it("no notifications", async function () {
        const user = createUser(1);
        await databaseFixture.populate({
          users: [user],
          notifications: [],
        });
        api.authorizationToken = await getTokenOfLoggedInUser(user);

        const response = await api.getUnseenNotifications();

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveLength(0);
      });

      it("successful get unseen notifications", async function () {
        const user = createUser(1);
        const notification1 = createNotification(user.id);
        const notification2 = createNotification(user.id);
        notification1.seen = true;
        await databaseFixture.populate({
          users: [user],
          notifications: [notification1, notification2],
        });
        api.authorizationToken = await getTokenOfLoggedInUser(user);

        const response = await api.getUnseenNotifications();

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0].seen).toBe(false);
      });

      it("successful set all notifications to seen 204", async function () {
        const user = createUser(1);
        const notification1 = createNotification(user.id);
        const notification2 = createNotification(user.id);
        const notification3 = createNotification(user.id);
        notification2.seen = true;
        await databaseFixture.populate({
          users: [user],
          notifications: [notification1, notification2, notification3],
        });
        api.authorizationToken = await getTokenOfLoggedInUser(user);
        const unseenNotificationsBefore =
          await databaseFixture.getUnseenNotifications(user.id);
        expect(unseenNotificationsBefore).toHaveLength(2);

        const response = await api.setAllNotificationsToSeen();

        expect(response.statusCode).toBe(204);
        const unseenNotifications =
          await databaseFixture.getUnseenNotifications(user.id);
        expect(unseenNotifications).toHaveLength(0);
      });
    });
  });

  describe("trees API /api/trees/", function () {
    describe("root", function () {
      it("returns trees", async function () {
        const data = createUserWithAdoptedTree();
        data.trees.push(createTree(createUniqueString()));
        await databaseFixture.populate(data);
        api.authorizationToken = await getTokenOfLoggedInUser(data.users[0]);

        const response = await api.trees();

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeTruthy();
        expect(response.body.data).toHaveLength(2);
        expect(response.body.data[0]).toHaveProperty("t");
        expect(response.body.data[0]).toHaveProperty("x");
        expect(response.body.data[0]).toHaveProperty("y");
        expect(response.body.data[0]).toHaveProperty("d");
      });
    });

    describe("user", function () {
      it("returns tree and joined userTree records of user", async function () {
        const data = createUsersWithAdoptedTrees(1, 2);
        await databaseFixture.populate(data);
        api.authorizationToken = await getTokenOfLoggedInUser(data.users[0]);

        const response = await api.getUserTrees();

        expect(response.statusCode).toBe(200);
        expect(response.body.data.trees).toBeTruthy();
        expect(response.body.data.trees).toHaveLength(2);
        expect(response.body.data.trees[0]).toHaveProperty("UserTree");
      });
    });

    describe("getUserData", function () {
      it("returns pairs of (userId, treeId) of adoptions", async function () {
        const data = createUsersWithAdoptedTrees(2, 3);
        await databaseFixture.populate(data);
        api.authorizationToken = await getTokenOfLoggedInUser(data.users[0]);

        const response = await api.getUserData();

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeTruthy();
        expect(response.body.data).toHaveLength(6);
        expect(response.body.data[0]).toHaveProperty("userId");
        expect(response.body.data[0]).toHaveProperty("treeId");
      });
    });

    describe("getTreeByZip", function () {
      it("returns (x, y) of first tree with matching zip", async function () {
        const zipCode = "55333";
        const data = {
          users: [createUser(1)],
          trees: [createTree(1), createTree(2)],
        };
        data.trees[0].zip = "55333";
        const xCoord = 22.345;
        data.trees[0].longitude = xCoord;
        data.trees[1].zip = "55333";
        await databaseFixture.populate(data);
        api.authorizationToken = await getTokenOfLoggedInUser(data.users[0]);

        const response = await api.getTreeByZip(zipCode);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("x");
        expect(response.body).toHaveProperty("y");
        expect(response.body.x).toEqual(xCoord);
      });

      it("not found 404", async function () {
        const zipCode = "55333";
        const data = {
          users: [createUser(1)],
          trees: [createTree(1), createTree(2)],
        };
        data.trees[0].zip = "11111";
        await databaseFixture.populate(data);
        api.authorizationToken = await getTokenOfLoggedInUser(data.users[0]);

        const response = await api.getTreeByZip(zipCode);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toEqual(
          greekTranslations.TREE_WITH_REQUESTED_ZIP_CODE_NOT_FOUND
        );
      });
    });

    describe("water", function () {
      it("successful water", async function () {
        const data = createUserWithAdoptedTree();
        const loggedInUser = data.users[0];
        const adoptedByLoggedInUserTree = data.trees[0];
        await databaseFixture.populate(data);
        api.authorizationToken = await getTokenOfLoggedInUser(loggedInUser);
        const wateredDateBefore = await databaseFixture.getTreeWateredDate(
          adoptedByLoggedInUserTree.id
        );

        const response = await api.waterTree(adoptedByLoggedInUserTree.id);

        expect(response.statusCode).toBe(200);
        const now = new Date();
        const today = now.toISOString().split("T")[0];
        expect(wateredDateBefore).toBeNull();
        expect(
          await databaseFixture.getTreeWateredDate(adoptedByLoggedInUserTree.id)
        ).toEqual(today);
      });

      it("water a not adopted tree 403 TREE_NOT_BELONGING_TO_USER", async function () {
        const loggedInUser = createUser(1);
        const availableTree = createTree(1);
        await databaseFixture.populate({
          users: [loggedInUser],
          trees: [availableTree],
          userTrees: [],
        });
        api.authorizationToken = await getTokenOfLoggedInUser(loggedInUser);

        const response = await api.waterTree(availableTree.id);

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toEqual(
          greekTranslations.TREE_NOT_BELONGING_TO_USER
        );
      });

      it("water a tree belonging to another user 403 TREE_NOT_BELONGING_TO_USER", async function () {
        const data = createUserWithAdoptedTree();
        const adoptedByOtherUserTree = data.trees[0];
        const loggedInUser = createUser(1);
        data.users.push(loggedInUser);
        await databaseFixture.populate(data);
        api.authorizationToken = await getTokenOfLoggedInUser(loggedInUser);

        const response = await api.waterTree(adoptedByOtherUserTree.id);

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toEqual(
          greekTranslations.TREE_NOT_BELONGING_TO_USER
        );
      });

      it("water unauthenticated 401 'Unauthorized'", async function () {
        await request(app).patch("/api/trees/50621/water").expect(401);
      });
    });

    describe("adopt", function () {
      it("successful adopt", async function () {
        const loggedInUser = createUser(1);
        const availableTree = createTree(1);
        await databaseFixture.populate({
          users: [loggedInUser],
          trees: [availableTree],
          userTrees: [],
        });
        api.authorizationToken = await getTokenOfLoggedInUser(loggedInUser);

        const response = await api.adopt(availableTree.id);

        expect(response.statusCode).toBe(200);
        const userTrees = await databaseFixture.getUserTrees(loggedInUser.id);
        expect(userTrees).toHaveLength(1);
        expect(userTrees[0].treeId).toBe(availableTree.id);
      });

      it("adopt more than 3 trees 403 MAX_TREES_ERROR_MSG", async function () {
        const data = createUserWithAdoptedTree();
        const loggedInUser = data.users[0];
        const availableTree2 = createTree(2);
        const availableTree3 = createTree(3);
        const availableTree4 = createTree(4);
        data.trees.push(availableTree2, availableTree3, availableTree4);
        await databaseFixture.populate(data);
        api.authorizationToken = await getTokenOfLoggedInUser(loggedInUser);

        await api.adopt(availableTree2.id);
        const response3 = await api.adopt(availableTree3.id);
        expect(response3.statusCode).toBe(200);
        const response4 = await api.adopt(availableTree4.id);

        expect(response4.statusCode).toBe(403);
        expect(response4.body.message).toEqual(
          greekTranslations.MAX_TREES_ERROR_MSG
        );
        const userTrees = await databaseFixture.getUserTrees(loggedInUser.id);
        expect(userTrees).toHaveLength(3);
      });

      it("adopt not existing tree 403 NOT_EXISTING_TREE", async function () {
        const loggedInUser = createUser(1);
        await databaseFixture.populate({
          users: [loggedInUser],
          trees: [],
          userTrees: [],
        });
        api.authorizationToken = await getTokenOfLoggedInUser(loggedInUser);
        const notExistingTreeId = createUniqueString();

        const response = await api.adopt(notExistingTreeId);

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toEqual(
          greekTranslations.NOT_EXISTING_TREE
        );
      });

      it("adopt tree of another user 403 TREE_UNAVAILABLE_ERROR_MSG", async function () {
        const data = createUserWithAdoptedTree();
        const adoptedByOtherUserTree = data.trees[0];
        const loggedInUser = createUser(1);
        data.users.push(loggedInUser);
        await databaseFixture.populate(data);
        api.authorizationToken = await getTokenOfLoggedInUser(loggedInUser);

        const response = await api.adopt(adoptedByOtherUserTree.id);

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toEqual(
          greekTranslations.TREE_UNAVAILABLE_ERROR_MSG
        );
      });
    });

    describe("rename", function () {
      it("successful rename", async function () {
        const data = createUserWithAdoptedTree();
        const loggedInUser = data.users[0];
        const adoptedByLoggedInUserTree = data.trees[0];
        await databaseFixture.populate(data);
        api.authorizationToken = await getTokenOfLoggedInUser(loggedInUser);
        const newName = createUniqueString().slice(0, 15);

        const response = await api.rename(
          adoptedByLoggedInUserTree.id,
          newName
        );

        expect(response.statusCode).toBe(200);
        const userTrees = await databaseFixture.getUserTrees(loggedInUser.id);
        expect(userTrees).toHaveLength(1);
        expect(userTrees[0].treeNickname).toBe(newName);
      });

      it("successful long name truncated to 15 chars", async function () {
        const data = createUserWithAdoptedTree();
        const loggedInUser = data.users[0];
        const adoptedByLoggedInUserTree = data.trees[0];
        await databaseFixture.populate(data);
        api.authorizationToken = await getTokenOfLoggedInUser(loggedInUser);
        const newName = "1234567890123456";

        const response = await api.rename(
          adoptedByLoggedInUserTree.id,
          newName
        );

        expect(response.statusCode).toBe(200);
        const userTrees = await databaseFixture.getUserTrees(loggedInUser.id);
        expect(userTrees).toHaveLength(1);
        expect(userTrees[0].treeNickname).toBe("123456789012345");
      });

      it("other user's tree 403", async function () {
        const data = createUserWithAdoptedTree();
        const adoptedByOtherUserTree = data.trees[0];
        const loggedInUser = createUser(1);
        data.users.push(loggedInUser);
        await databaseFixture.populate(data);
        api.authorizationToken = await getTokenOfLoggedInUser(loggedInUser);
        const newName = createUniqueString();

        const response = await api.rename(adoptedByOtherUserTree.id, newName);

        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual({});
      });
    });

    describe("abandon", function () {
      it("successful abandon", async function () {
        const data = createUserWithAdoptedTree();
        const loggedInUser = data.users[0];
        const adoptedByLoggedInUserTree = data.trees[0];
        await databaseFixture.populate(data);
        api.authorizationToken = await getTokenOfLoggedInUser(loggedInUser);

        const response = await api.abandon(adoptedByLoggedInUserTree.id);

        expect(response.statusCode).toBe(200);
        const userTrees = await databaseFixture.getUserTrees(loggedInUser.id);
        expect(userTrees).toHaveLength(0);
      });

      it("other user's 403 TREE_NOT_BELONGING_TO_USER", async function () {
        const data = createUserWithAdoptedTree();
        const adoptedByOtherUserTree = data.trees[0];
        const loggedInUser = createUser(1);
        data.users.push(loggedInUser);
        await databaseFixture.populate(data);
        api.authorizationToken = await getTokenOfLoggedInUser(loggedInUser);

        const response = await api.abandon(adoptedByOtherUserTree.id);

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toEqual(
          greekTranslations.TREE_NOT_BELONGING_TO_USER
        );
      });
    });

    describe("get treenickname", function () {
      it("successful treenickname", async function () {
        const data = createUserWithAdoptedTree();
        const loggedInUser = data.users[0];
        const adoptedByLoggedInUserTree = data.trees[0];
        const treeNickname = "Tree" + loggedInUser.id;
        data.userTrees[0].treeNickname = treeNickname;
        await databaseFixture.populate(data);
        api.authorizationToken = await getTokenOfLoggedInUser(loggedInUser);

        const response = await api.treeNickname(adoptedByLoggedInUserTree.id);

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeTruthy();
        expect(response.body.data.treeNickname).toEqual(treeNickname);
      });

      it("other user's 403 TREE_NOT_BELONGING_TO_USER", async function () {
        const data = createUserWithAdoptedTree();
        const adoptedByOtherUserTree = data.trees[0];
        const loggedInUser = createUser(1);
        data.users.push(loggedInUser);
        await databaseFixture.populate(data);
        api.authorizationToken = await getTokenOfLoggedInUser(loggedInUser);

        const response = await api.treeNickname(adoptedByOtherUserTree.id);

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toEqual(
          greekTranslations.TREE_NOT_BELONGING_TO_USER
        );
      });

      it("not existing 403 TREE_NOT_BELONGING_TO_USER", async function () {
        const loggedInUser = createUser(1);
        await databaseFixture.populate({
          users: [loggedInUser],
          trees: [],
          userTrees: [],
        });
        api.authorizationToken = await getTokenOfLoggedInUser(loggedInUser);

        const response = await api.treeNickname(createUniqueString());

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toEqual(
          greekTranslations.TREE_NOT_BELONGING_TO_USER
        );
      });
    });

    describe("get tree info", function () {
      it("successful tree info", async function () {
        const loggedInUser = createUser(1);
        const tree = createTree(1);
        await databaseFixture.populate({
          users: [loggedInUser],
          trees: [tree],
        });
        api.authorizationToken = await getTokenOfLoggedInUser(loggedInUser);

        const response = await api.getTreeInfo(tree.id);

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeTruthy();
      });

      it("not existing tree 200 null", async function () {
        const loggedInUser = createUser(1);
        const tree = createTree(1);
        await databaseFixture.populate({
          users: [loggedInUser],
          trees: [tree],
        });
        api.authorizationToken = await getTokenOfLoggedInUser(loggedInUser);

        const response = await api.getTreeInfo(createUniqueString());

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeNull();
      });

      it("unauthorised 401 AUTHORIZATION_PROBLEM", async function () {
        const loggedInUser = createUser(1);
        const tree = createTree(1);
        await databaseFixture.populate({
          users: [loggedInUser],
          trees: [tree],
        });

        const response = await api.getTreeInfo(tree.id);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual(
          greekTranslations.AUTHORIZATION_PROBLEM
        );
      });
    });

    describe("sendUnwateredNotifications", function () {
      it("watered more than 4 days ago", async function () {
        const data = createUserWithAdoptedTree();
        data.trees[0].lastWateredDate = add(new Date(), { days: -5 });
        await databaseFixture.populate(data);

        const response = await api.sendUnwateredNotifications();

        expect(response.statusCode).toBe(200);
        // ASSERTIONS for new notifications and emails sent
        const notifications1 = await databaseFixture.getUnseenNotifications(
          data.users[0].id
        );
        expect(notifications1).toHaveLength(1);
        expect(notifications1[0].category).toEqual("unwateredTrees");
        expect(notifications1[0].seen).toEqual(false);

        sinon.assert.calledOnce(sendEmailStub);
        const emailArguments = sendEmailStub.getCall(0).args;
        expect(emailArguments[0]).toEqual(data.users[0].email);
        expect(emailArguments[1]).toEqual(
          greekTranslations.emailLanguage.wateringNotificationEmailSubject
        );
      });

      it("2 trees watered more than 4 days ago", async function () {
        const data = createUsersWithAdoptedTrees(1, 2);
        data.trees[0].lastWateredDate = add(new Date(), { days: -5 });
        data.trees[1].lastWateredDate = add(new Date(), { days: -5 });
        await databaseFixture.populate(data);

        const response = await api.sendUnwateredNotifications();

        expect(response.statusCode).toBe(200);
        // ASSERTIONS for new notifications and emails sent
        const notifications1 = await databaseFixture.getUnseenNotifications(
          data.users[0].id
        );
        expect(notifications1).toHaveLength(1);
        expect(notifications1[0].category).toEqual("unwateredTrees");
        expect(notifications1[0].seen).toEqual(false);

        sinon.assert.calledOnce(sendEmailStub);
        const emailArguments = sendEmailStub.getCall(0).args;
        expect(emailArguments[0]).toEqual(data.users[0].email);
        expect(emailArguments[1]).toEqual(
          greekTranslations.emailLanguage.wateringNotificationEmailSubject
        );
      });

      it("watered 4 days ago", async function () {
        const data = createUserWithAdoptedTree();
        data.trees[0].lastWateredDate = add(new Date(), { days: -4 });
        await databaseFixture.populate(data);

        const response = await api.sendUnwateredNotifications();

        expect(response.statusCode).toBe(200);
        // ASSERTIONS for new notifications and emails sent
        const notifications1 = await databaseFixture.getUnseenNotifications(
          data.users[0].id
        );
        expect(notifications1).toHaveLength(0);

        sinon.assert.notCalled(sendEmailStub);
      });
    });

    describe("statistics", function () {
      it("empty", async function () {
        await databaseFixture.populate({});
        const response = await api.statistics();

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
          users: [],
          adoptions: [],
          waterings: [],
        });
      });

      it("one user, adoption, watering", async function () {
        const data = createUserWithAdoptedTree();
        data.trees[0].lastWateredDate = new Date();
        await databaseFixture.populate(data);

        const response = await api.statistics();

        expect(response.statusCode).toBe(200);
        expect(response.body.users).toHaveLength(1);
        expect(response.body.adoptions).toHaveLength(1);
        expect(response.body.waterings).toHaveLength(1);
      });

      it("many users, adoptions", async function () {
        const data = createUsersWithAdoptedTrees(3, 2);
        data.users[0].createdAt = add(new Date(), { days: -1 });
        data.userTrees[0].createdAt = add(new Date(), { days: -1 });
        await databaseFixture.populate(data);

        const response = await api.statistics();

        expect(response.statusCode).toBe(200);
        expect(response.body.users).toHaveLength(2);
        expect(response.body.adoptions).toHaveLength(2);
        expect(response.body.waterings).toHaveLength(0);
      });
    });
  });
});
