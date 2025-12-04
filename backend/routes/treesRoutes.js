const express = require("express");
const treesControllers = require("../controllers/treesController");

const treesRouter = express.Router();
const verifyToken = require("../middlewares/authJwt");
const { param, body } = require("express-validator");
const inputValidation = require("../middlewares/inputValidation");
treesRouter.use(verifyToken);

treesRouter.get("/", treesControllers.getTrees);
treesRouter.get("/version", treesControllers.getVersion);
treesRouter.get("/getUserData", treesControllers.getUserTreeData);
treesRouter.get("/user", treesControllers.getTreesByUserId);

treesRouter.get(
  "/getTreeByZip/:zip",
  param("zip").exists().isInt(),
  inputValidation,
  treesControllers.getTreeByZip
);

treesRouter.get(
  "/:tid/treenickname",
  param("tid").exists(),
  inputValidation,
  treesControllers.getUserTree
);
treesRouter.get(
  "/:tid/getTreeInfo",
  param("tid").exists(),
  inputValidation,
  treesControllers.getTreeInfo
);
treesRouter.patch(
  "/:tid/abandon",
  param("tid").exists(),
  inputValidation,
  treesControllers.abandonTree
);
treesRouter.patch(
  "/:tid/water",
  param("tid").exists(),
  inputValidation,
  treesControllers.waterTree
);
treesRouter.patch(
  "/:tid/adopt",
  param("tid").exists(),
  inputValidation,
  treesControllers.adoptTree
);
treesRouter.patch(
  "/:tid/rename",
  [param("tid").exists(), body("name").isLength({ max: 16 })],
  inputValidation,
  treesControllers.renameTree
);

module.exports = treesRouter;
