import { jwtVerify } from "../helpers/jwt.js";
import { AppError } from "../lib/error.js";
import { UserModel } from "../models/user.js";

// middleware to authenticate user and check role
export const authMiddleware = (...roles) => {
  return async (req, res, next) => {
    // get token from header
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      throw new AppError(401, "unauthorized");
    }

    // verify token
    let decoded;
    try {
      decoded = jwtVerify(token);
    } catch (error) {
      throw new AppError(401, "unauthorized");
    }

    // check if token is valid
    if (!decoded || !decoded.userId) {
      throw new AppError(401, "unauthorized");
    }

    // check if user exists
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      throw new AppError(401, "unauthorized");
    }

    if (user.deactivated) {
      throw new AppError(401, "unauthorized");
    }

    // check if user role is allowed
    if (roles.length && !roles.includes(user.role)) {
      throw new AppError(403, "forbidden");
    }

    // set user in request object
    req.user = user;

    next();
  };
};
