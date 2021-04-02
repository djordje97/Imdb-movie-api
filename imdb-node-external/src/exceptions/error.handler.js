const errorHandler = (err, res) => {
  const error = err;
  error.statusCode = error.statusCode || 500;
  error.message = error.message || 'Server error';
  const { statusCode, message } = error;
  res.status(statusCode).send({ statusCode, message });
};

module.exports = errorHandler;
