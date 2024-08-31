// Error handler middleware to catch all errors
export const errorHanlder = (err, req, res, next) => {
  // log the error
  console.error(err);

  // check if error is a mongoose validation error for duplicate key
  if (err.name === "MongoServerError" && err.code === 11000) {
    err.statusCode = 400;
    if (err.keyPattern.email) {
      err.message = "User with this email already exists";
    } else if (err.keyPattern.title) {
      // since we are using title as unique key only for topics
      err.message = "Topic with this title already exists";
    } else {
      err.message = `Duplicate key error: ${Object.keys(err.keyPattern)}`;
    }
  }

  // set status code and return error message
  const code = err.statusCode || 500;

  // send response
  res.status(code).json({
    message: err.message || "internal server error",
    code,
  });
};
