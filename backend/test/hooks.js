const { Sequelize } = require("sequelize");
const sinon = require("sinon");

const factory = require("../factories/factory");

sinon.stub(factory, "createDB").callsFake(() => {
  console.log("IN MEMORY DB");
  return new Sequelize("sqlite::memory:", { logging: false });
});

const nullMiddleware = function (request, response, next) {
  next();
};

const pinoHttp = require("../util/pinoHttp");
sinon
  .stub(pinoHttp, "pinoHttpLogging")
  .callsFake(function (request, response, next) {
    // console.log(request.method, request.url, request.body);
    next();
  });

const apiLimiter = require("../middlewares/apiLimiter");
sinon.stub(apiLimiter, "apiLimiter").callsFake(nullMiddleware);
