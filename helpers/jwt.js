import jwt from "jsonwebtoken";
import { JWT_EXPIRATION } from "../globals.js";

// secret key for jwt token signing and verification
const jwtSecret = process.env.JWT_SECRET;

// verify jwt token
export const jwtVerify = (token) => {
  return jwt.verify(token, jwtSecret);
};

// sign jwt token
export const jwtSign = async (userId) => {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: JWT_EXPIRATION });
};
