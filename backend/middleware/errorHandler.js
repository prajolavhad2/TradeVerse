function notFoundHandler(req, res, next) {
  res.status(404).send("Route not found");
}

function errorHandler(err, req, res, next) {
  console.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }

  res
    .status(err.status || 500)
    .send(
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message || "Something went wrong",
    );
}

module.exports = { notFoundHandler, errorHandler };
