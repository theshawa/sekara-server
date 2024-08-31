import Joi from "joi";
import { jwtVerify } from "../../helpers/jwt.js";
import { AppError } from "../../lib/error.js";
import { UserModel } from "../../models/user.js";

// request body validation schema
const bodySchema = Joi.object({
  token: Joi.string().required().label("Token"),
});
export const validateUserToken = async (req, res) => {
  // validate request body
  const { value, error } = bodySchema.validate(req.body);
  if (error) {
    throw new AppError(400, error.message || "invalid body");
  }

  const { token } = value;

  // verify token
  let decoded;
  try {
    decoded = jwtVerify(token);
  } catch (error) {
    return res.json({
      user: null,
    });
  }

  // check if token is valid
  if (!decoded || !decoded.userId) {
    return res.json({
      user: null,
    });
  }

  // check if user exists
  const user = await UserModel.findById(decoded.userId);
  if (!user) {
    return res.json({
      user: null,
    });
  }

  res.json({
    user: {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      description: user.description,
    },
  });
};
