import Joi from "joi";
import { jwtSign } from "../../helpers/jwt.js";
import { AppError } from "../../lib/error.js";
import { UserModel } from "../../models/user.js";

const bodySchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string(),
});

export const userRegister = async (req, res) => {
  const { value, error } = bodySchema.validate(req.body);
  if (error) {
    throw new AppError(400, error.message || "invalid body");
  }

  const { email, password, firstName, lastName } = value;

  const alreadyUser = await UserModel.findOne({ email });
  if (alreadyUser) {
    throw new AppError(400, "user already exists");
  }

  const user = new UserModel({ email, password, firstName, lastName });
  await user.save();

  const token = await jwtSign(user._id);

  res.json({
    token,
    _id: user._id,
  });
};
