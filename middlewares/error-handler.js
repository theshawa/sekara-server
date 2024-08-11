export const errorHanlder = (err, req, res, next) => {
  console.error(err);
  const code = err.statusCode || 500;
  res.status(code).json({
    message: err.message || "internal server error",
    code,
  });
};
