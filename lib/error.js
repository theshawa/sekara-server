export class AppError extends Error {
  constructor(statusCode = 500, message = "") {
    super(message);

    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}
