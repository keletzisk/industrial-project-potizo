const TreeRepo = require("../repositories/treeRepository");
const HttpError = require("../models/errors/httpError");
const greekTranslations = require("../util/language");
const TreeZipCodeNotFoundError = require("../models/errors/treeZipCodeNotFoundError");

async function getVersion(request, response) {
  return response.status(200).json({
    data: process.env.TREE_DATA_VERSION,
  });
}

async function getUserTree(request, response, next) {
  const treeId = request.params.tid;
  const userId = request.jwtUserId;

  const userTree = await TreeRepo.getUserTreeByTreeIdAndUserId(treeId, userId);
  if (!userTree)
    return next(
      new HttpError(greekTranslations.TREE_NOT_BELONGING_TO_USER, 403)
    );

  response.status(200).json({
    data: userTree,
  });
}

async function getTreesByUserId(request, response) {
  const userId = request.jwtUserId;
  const userWithTrees = await TreeRepo.getTreeByUserID(userId);

  response.status(200).json({
    data: {
      trees: userWithTrees.Trees,
    },
  });
}

async function getTrees(request, response) {
  const trees = await TreeRepo.getAllTrees();
  response.status(200).json({
    data: trees,
  });
}

async function getUserTreeData(request, response) {
  const userTreeData = await TreeRepo.getAllUserTreeData();
  response.status(200).json({
    data: userTreeData,
  });
}

async function getTreeInfo(request, response) {
  const treeId = request.params.tid;
  const treeInfo = await TreeRepo.getTreeInfoByID(treeId);
  response.status(200).json({
    data: treeInfo,
  });
}

async function getTreeByZip(request, response, next) {
  const zip = request.params.zip;

  try {
    const data = await TreeRepo.getTreeByZip(zip);
    response.status(200).json(data);
  } catch (error) {
    if (error instanceof TreeZipCodeNotFoundError) {
      return next(new HttpError(error.message, 404));
    }
    return next(error);
  }
}

async function abandonTree(request, response, next) {
  const treeId = request.params.tid;
  const userId = request.jwtUserId;

  const tree = await TreeRepo.getUserTreeByTreeIdAndUserId(treeId, userId);
  if (!tree)
    return next(
      new HttpError(greekTranslations.TREE_NOT_BELONGING_TO_USER, 403)
    );

  await TreeRepo.abandonTree(userId, treeId);
  response.status(200).send();
}

async function waterTree(request, response, next) {
  const treeId = request.params.tid;
  const userId = request.jwtUserId;

  const tree = await TreeRepo.getUserTreeByTreeIdAndUserId(treeId, userId);
  if (!tree)
    return next(
      new HttpError(greekTranslations.TREE_NOT_BELONGING_TO_USER, 403)
    );

  await TreeRepo.waterTree(treeId);
  response.status(200).send();
}

async function adoptTree(request, response, next) {
  const treeId = request.params.tid;
  const userId = request.jwtUserId;

  const treeInfo = await TreeRepo.getTreeInfoByID(treeId);

  if (!treeInfo) {
    return next(new HttpError(greekTranslations.NOT_EXISTING_TREE, 403));
  }

  const count = await TreeRepo.countUserTrees(userId);

  if (count >= 3) {
    return next(new HttpError(greekTranslations.MAX_TREES_ERROR_MSG, 403));
  }

  const available = await TreeRepo.checkTreeAvailability(treeId);
  if (!available) {
    return next(
      new HttpError(greekTranslations.TREE_UNAVAILABLE_ERROR_MSG, 403)
    );
  }

  await TreeRepo.adoptTree(treeId, userId);
  response.status(200).send();
}

async function renameTree(request, response) {
  const treeId = request.params.tid;
  const userId = request.jwtUserId;

  const treeNickname =
    request.body.name.length > 15
      ? request.body.name.slice(0, 15)
      : request.body.name;

  const userTree = await TreeRepo.renameTree(treeId, userId, treeNickname);
  const status = userTree ? 200 : 403;
  response.status(status).send();
}

module.exports = {
  getTreeInfo,
  getVersion,
  getTreeByZip,
  getTreesByUserId,
  getTrees,
  abandonTree,
  waterTree,
  adoptTree,
  renameTree,
  getUserTree,
  getUserTreeData,
};
