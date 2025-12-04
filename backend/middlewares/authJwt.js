const jwt = require("jsonwebtoken");
const HttpError = require("../models/errors/httpError");
const greekTranslations = require("../util/language");

const verifyToken = async (request, response, next) => {
  if (request?.headers?.authorization?.split(" ")[0] !== "JWT")
    return next(new HttpError(greekTranslations.AUTHORIZATION_PROBLEM, 401));

  jwt.verify(
    request.headers.authorization.split(" ")[1],
    process.env.JWT_KEY,

    /**
     *  {
     *    userId: 1,
     *    email: 'test123@gmail.com',
     *    iat: 1685393757,
     *    exp: 1685397357
     *  }
     */
    function (error, decode) {
      if (error) {
        next(new HttpError(greekTranslations.AUTHORIZATION_PROBLEM, 401));
      } else {
        request.jwtUserId = decode.userId;
        next();
      }
    }
  );
};

module.exports = verifyToken;
