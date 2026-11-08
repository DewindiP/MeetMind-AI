const HttpError = require("../utils/http-error");

function notFoundHandler(req, res, next) {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = Number.isInteger(err.statusCode)
    ? err.statusCode
    : err.name === "PrismaClientKnownRequestError"
      ? 400
      : 500;

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message:
      statusCode >= 500
        ? "An unexpected server error occurred."
        : err.message || "Request failed.",
  });
}

module.exports = { notFoundHandler, errorHandler };