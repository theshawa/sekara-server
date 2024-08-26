import jwt from "jsonwebtoken";

// secret key for jwt token signing and verification
const jwtSecret = process.env.JWT_SECRET;

// verify jwt token
export const jwtVerify = (token) => {
  return jwt.verify(token, jwtSecret);
};

// sign jwt token
export const jwtSign = async (userId) => {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: "1d" });
};
