import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

export const jwtVerify = (token) => {
  return jwt.verify(token, jwtSecret);
};

export const jwtSign = async (userId) => {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: "1d" });
};
