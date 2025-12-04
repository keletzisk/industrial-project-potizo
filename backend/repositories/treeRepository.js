const database = require("../models/db");
const TreeZipCodeNotFoundError = require("../models/errors/treeZipCodeNotFoundError");
const MinifiedTreeResponse = require("../models/responses/minifiedTreeResponse");

const Tree = database.Tree;
const User = database.User;
const UserTree = database.UserTree;

const TreeRepository = {
  async getTreeByUserID(id) {
    return await User.findOne({
      include: Tree,
      where: { id },
    });
  },

  async getUserTreeByTreeIdAndUserId(treeId, userId) {
    return await UserTree.findOne({
      where: { treeId, userId },
    });
  },

  async getAllTrees() {
    const trees = await Tree.findAll({
      attributes: ["id", "latitude", "longitude", "createdAt", "type"],
    });

    console.log(trees);

    return trees.map((tree) => new MinifiedTreeResponse(tree));
  },

  async getAllUserTreeData() {
    return await UserTree.findAll({
      attributes: ["userId", "treeId"],
    });
  },

  async getTreeInfoByID(treeId) {
    return await Tree.findOne({
      where: { id: treeId },
    });
  },

  async getTreeByZip(zipcode) {
    const tree = await Tree.findOne({
      where: { zip: zipcode },
    });

    if (!tree) throw new TreeZipCodeNotFoundError();

    const precision = 1e6;
    return {
      x: Math.round(tree.longitude * precision) / precision,
      y: Math.round(tree.latitude * precision) / precision,
    };
  },

  async abandonTree(userId, treeId) {
    return await UserTree.destroy({
      where: {
        userId,
        treeId,
      },
    });
  },

  async waterTree(id) {
    const tree = await Tree.findOne({
      where: {
        id,
      },
    });

    return await tree.update({
      lastWateredDate: new Date(),
    });
  },

  async checkTreeAvailability(treeId) {
    const tree = await UserTree.findOne({
      where: {
        treeId,
      },
    });
    return !tree;
  },

  async adoptTree(treeId, userId) {
    return await UserTree.create({
      userId,
      treeId,
    });
  },

  async countUserTrees(userId) {
    return await UserTree.count({
      where: {
        userId,
      },
    });
  },

  async renameTree(treeId, userId, treeNickname) {
    const userTree = await UserTree.findOne({
      where: {
        userId,
        treeId,
      },
    });

    if (!userTree) return;

    userTree.set({
      treeNickname,
    });

    return await userTree.save();
  },
};

module.exports = TreeRepository;
