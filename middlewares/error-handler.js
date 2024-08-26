// Error handler middleware to catch all errors
export const errorHanlder = (err, req, res, next) => {
  // log the error
  console.error(err);

  // set status code and return error message
  const code = err.statusCode || 500;

  // send response
  res.status(code).json({
    message: err.message || "internal server error",
    code,
  });
};
