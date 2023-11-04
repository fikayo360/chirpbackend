const AppError = require('../AppError')

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  if (err.name === "ValidationError") {
    return res.status(400).send({
      type: "ValidationError",
      details: err.details,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      errorCode: err.errorCode,
    });
  }

  return res.status(500).send("Something went wrong");

};

module.exports = errorHandlerMiddleware;
