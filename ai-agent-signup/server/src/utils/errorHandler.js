const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the full error stack trace

  // Default to a 500 Internal Server Error
  let statusCode = 500;
  let message = "Internal Server Error";

  // Customize the error message based on the error type
  if (err.message) {
    message = err.message;
  }

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
