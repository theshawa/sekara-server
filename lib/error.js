// Custom error class to handle errors in the application
export class AppError extends Error {
  constructor(statusCode = 500, message = "") {
    // call the parent constructor
    super(message);

    // set the status code
    this.statusCode = statusCode;

    // capture the stack trace to the current position
    Error.captureStackTrace(this, this.constructor);
  }
}
