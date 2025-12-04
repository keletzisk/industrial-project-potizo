require("./hooks");

const { describe, it, after, before, beforeEach, afterEach } = require("mocha");
const { expect } = require("expect");

const { DBFixture } = require("./freshDatabase");
const { deleteUnverifiedUsers } = require("../repositories/userRepository");
const {
  createNotVerifiedUser,
  createUser,
  getNextNumber,
} = require("./factory");

describe("Testing functions called by cron jobs", function () {
  this.timeout(0);
  let databaseFixture = null;

  before(function () {});

  beforeEach(async function () {
    databaseFixture = new DBFixture();
  });

  afterEach(async function () {});

  after(async function () {});

  describe("#deleteUnverifiedUsers", function () {
    it("empty users", async function () {
      await databaseFixture.populate({ users: [] });
      await deleteUnverifiedUsers();
    });

    it("mix of verified, unverified and unverified expired", async function () {
      const notVerifiedUser1 = createNotVerifiedUser(getNextNumber(), -1);
      const notVerifiedUser2 = createNotVerifiedUser(getNextNumber(), -5);
      const notVerifiedUserNotExpired = createNotVerifiedUser(
        getNextNumber(),
        1
      );
      const verifiedUser = createUser(getNextNumber());
      await databaseFixture.populate({
        users: [
          notVerifiedUser1,
          verifiedUser,
          notVerifiedUser2,
          notVerifiedUserNotExpired,
        ],
      });

      await deleteUnverifiedUsers();

      expect(
        await databaseFixture.getUserByEmail(verifiedUser.email)
      ).toBeTruthy();
      expect(
        await databaseFixture.getUserByEmail(notVerifiedUserNotExpired.email)
      ).toBeTruthy();
      expect(
        await databaseFixture.getUserByEmail(notVerifiedUser1.email)
      ).toBeNull();
      expect(
        await databaseFixture.getUserByEmail(notVerifiedUser2.email)
      ).toBeNull();
    });
  });
});
