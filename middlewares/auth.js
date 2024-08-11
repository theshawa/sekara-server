import { jwtVerify } from "../helpers/jwt.js";
import { AppError } from "../lib/error.js";
import { UserModel } from "../models/user.js";

export const authMiddleware = (...roles) => {
  return async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      throw new AppError(401, "unauthorized");
    }

    let decoded;
    try {
      decoded = jwtVerify(token);
    } catch (error) {
      throw new AppError(401, "unauthorized");
    }

    if (!decoded || !decoded.userId) {
      throw new AppError(401, "unauthorized");
    }

    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      throw new AppError(401, "unauthorized");
    }

    if (roles.length && !roles.includes(user.role)) {
      throw new AppError(403, "forbidden");
    }

    req.user = user;

    next();
  };
};
