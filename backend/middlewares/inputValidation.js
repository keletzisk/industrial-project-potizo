const HttpError = require("../models/errors/httpError");
const { validationResult } = require("express-validator");
const greekTranslations = require("../util/language");

const inputValidation = async (request, response, next) => {
  const errors = validationResult(request);
  if (errors.isEmpty()) return next();

  return next(new HttpError(greekTranslations.VALIDATION_FAILED, 422));
};

module.exports = inputValidation;
