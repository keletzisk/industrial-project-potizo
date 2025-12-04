const getNextNumberFun = function () {
  let nextNumber = Date.now(); // start with current ms after 0

  return function () {
    return nextNumber++; // and increase each time is called
  };
};

// Create an instance of the function
const getNextNumber = getNextNumberFun();

const createUniqueString = function () {
  return "" + getNextNumber();
};

const createUser = function (id) {
  return {
    id: id,
    email: "email" + id + "@gmail.com",
    password: "password" + id,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const createTree = function (id) {
  return {
    id: id,
    name: "Tree" + id,
    type: "Ιβίσκος",
    address: "Streetname " + id,
    latitude: 40.596_717_947_777,
    longitude: 22.961_785_197_258,
    zip: "54248",
    createdAt: "2023-01-01", // new tree
  };
};

const createUserTree = function (userId, treeId) {
  return {
    id: getNextNumber(),
    userId: userId,
    treeId: treeId,
    treeNickname: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const createNotVerifiedUser = function (id, expiresAfterMinutes = 30) {
  const notVerifiedUser = createUser(id);
  notVerifiedUser.isVerified = false;
  notVerifiedUser.verificationCode = createUniqueString();
  notVerifiedUser.verificationTokenExpiry = new Date();
  notVerifiedUser.verificationTokenExpiry.setMinutes(
    notVerifiedUser.verificationTokenExpiry.getMinutes() + expiresAfterMinutes
  );
  return notVerifiedUser;
};

const createGoogleUser = function (id) {
  const user = createUser(id);
  user.googleId = createUniqueString();
  user.verificationCode = "GOOGLE";
  return user;
};

const createResetPwdUser = function (id, expiresAfterMinutes) {
  const resetPwdUser = createUser(id);
  resetPwdUser.resetPasswordToken = createUniqueString();
  resetPwdUser.resetPasswordTokenExpiry = new Date();
  resetPwdUser.resetPasswordTokenExpiry.setMinutes(
    resetPwdUser.resetPasswordTokenExpiry.getMinutes() + expiresAfterMinutes
  );
  return resetPwdUser;
};

const createUserWithAdoptedTree = function () {
  const user = createUser(getNextNumber());
  const tree = createTree(getNextNumber());
  const userTree = createUserTree(user.id, tree.id);
  return { users: [user], trees: [tree], userTrees: [userTree] };
};

const createUsersWithAdoptedTrees = function (noUsers, noTrees) {
  const users = [];
  const trees = [];
  const userTrees = [];
  for (let index = 0; index < noUsers; index++) {
    users.push(createUser(index));
    for (let treeIndex = 0; treeIndex < noTrees; treeIndex++) {
      const tree = createTree(getNextNumber());
      trees.push(tree);
      userTrees.push(createUserTree(index, tree.id));
    }
  }
  return { users: users, trees: trees, userTrees: userTrees };
};

const createNotification = function (userId) {
  return {
    id: getNextNumber(),
    userId: userId,
    category: "category",
    header: createUniqueString(),
    message: createUniqueString(),
    seen: false,
    sentAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

module.exports = {
  createUniqueString,
  createUser,
  createTree,
  createUserTree,
  createGoogleUser,
  createNotVerifiedUser,
  createResetPwdUser,
  createUserWithAdoptedTree,
  createUsersWithAdoptedTrees,
  createNotification,
  getNextNumber,
};
