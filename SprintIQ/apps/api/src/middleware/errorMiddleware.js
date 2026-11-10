function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  if (process.env.NODE_ENV !== 'test') console.error(err.message);
  res.status(status).json({
    success: false,
    message: status === 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error'
  });
}

module.exports = { notFound, errorHandler };
