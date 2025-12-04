const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const assert = require("node:assert");

const { shouldNotifyUser } = require("../services/notifications");

const june = (d) => "2023-06-" + (d < 10 ? "0" + d : d);

describe("#shouldNotifyUser()", function () {
  it("should return TRUE when notifications is empty", function () {
    assert.equal(shouldNotifyUser([], new Date()), true);
  });

  it("should return FALSE when there is an unseen notification 1 day ago", function () {
    const notifications = [{ sentAt: june(1), seen: false }];
    const now = new Date(june(2));
    assert.equal(shouldNotifyUser(notifications, now), false);
  });

  it("should return TRUE when there is an unseen notification 2 days ago", function () {
    const notifications = [{ sentAt: june(1), seen: false }];
    const now = new Date(june(3));
    assert.equal(shouldNotifyUser(notifications, now), true);
  });

  it("should return FALSE when there are TWO unseen notifications 3 days ago", function () {
    const notifications = [
      { sentAt: june(1), seen: false },
      { sentAt: june(2), seen: false },
    ];
    const now = new Date("2023-06-05");
    assert.equal(shouldNotifyUser(notifications, now), false);
  });

  it("should return TRUE when there are TWO unseen notifications 4 days ago", function () {
    const notifications = [
      { sentAt: june(1), seen: false },
      { sentAt: june(2), seen: false },
    ];
    const now = new Date(june(6));
    assert.equal(shouldNotifyUser(notifications, now), true);
  });

  it("should return FALSE when there are THREE unseen notifications 7 days ago", function () {
    const notifications = [
      { sentAt: june(1), seen: false },
      { sentAt: june(2), seen: false },
      { sentAt: june(6), seen: false },
    ];
    const now = new Date("2023-06-13");
    assert.equal(shouldNotifyUser(notifications, now), false);
  });

  it("should return TRUE when there are THREE unseen notifications 8 days ago", function () {
    const notifications = [
      { sentAt: june(1), seen: false },
      { sentAt: june(2), seen: false },
      { sentAt: june(6), seen: false },
    ];
    const now = new Date("2023-06-14");
    assert.equal(shouldNotifyUser(notifications, now), true);
  });

  it("should return TRUE when there is an SEEN notification 1 day ago", function () {
    const notifications = [{ sentAt: june(1), seen: true }];
    const now = new Date(june(2));
    assert.equal(shouldNotifyUser(notifications, now), true);
  });

  it("should return FALSE when there is a seen and then an unseen notification 1 day ago ", function () {
    const notifications = [
      { sentAt: june(1), seen: true },
      { sentAt: june(2), seen: false },
    ];
    const now = new Date(june(3));
    assert.equal(shouldNotifyUser(notifications, now), false);
  });

  it("should return TRUE when there is a seen and then an unseen notification 2 days ago ", function () {
    const notifications = [
      { sentAt: june(1), seen: true },
      { sentAt: june(2), seen: false },
    ];
    const now = new Date("2023-06-04");
    assert.equal(shouldNotifyUser(notifications, now), true);
  });

  it("should return FALSE when there is an unseen notification 1 day ago, after the last seen", function () {
    const notifications = [
      { sentAt: "2023-05-23", seen: false },
      { sentAt: "2023-05-26", seen: false },
      { sentAt: june(1), seen: true },
      { sentAt: june(2), seen: false },
    ];
    const now = new Date(june(3));
    assert.equal(shouldNotifyUser(notifications, now), false);
  });

  it("should return TRUE when there is an unseen notification 2 day ago, after the last seen", function () {
    const notifications = [
      { sentAt: "2023-05-25", seen: false },
      { sentAt: "2023-05-27", seen: false },
      { sentAt: june(1), seen: true },
      { sentAt: june(2), seen: false },
    ];
    const now = new Date(june(4));
    assert.equal(shouldNotifyUser(notifications, now), true);
  });

  it("should return FALSE when there is an unseen notification 1 day ago, after the last seen (many seens)", function () {
    const notifications = [
      { sentAt: "2023-05-20", seen: false },
      { sentAt: "2023-05-24", seen: true },
      { sentAt: "2023-05-28", seen: false },
      { sentAt: june(1), seen: true },
      { sentAt: june(2), seen: false },
    ];
    const now = new Date(june(3));
    assert.equal(shouldNotifyUser(notifications, now), false);
  });

  it("should return TRUE when there is an unseen notification 2 day ago, after the last seen (many seens)", function () {
    const notifications = [
      { sentAt: "2023-05-20", seen: false },
      { sentAt: "2023-05-24", seen: true },
      { sentAt: "2023-05-28", seen: false },
      { sentAt: june(1), seen: true },
      { sentAt: june(2), seen: false },
    ];
    const now = new Date(june(4));
    assert.equal(shouldNotifyUser(notifications, now), true);
  });
});
