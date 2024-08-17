import Joi from "joi";
import { encryptPassword } from "../../helpers/bcrypt.js";
import { AppError } from "../../lib/error.js";
import { UserModel } from "../../models/user.js";

const bodySchema = Joi.object({
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().min(6).required().label("Password"),
  firstName: Joi.string().required().label("First Name"),
  lastName: Joi.string().allow("").label("Last Name"),
});

export const signUpUser = async (req, res) => {
  const { value, error } = bodySchema.validate(req.body);
  if (error) {
    throw new AppError(400, error.message || "invalid body");
  }

  const { email, password, firstName, lastName } = value;

  const alreadyUser = await UserModel.findOne({ email });
  if (alreadyUser) {
    throw new AppError(400, "user already exists");
  }

  const passwordHash = await encryptPassword(password);

  const user = new UserModel({
    email,
    password: passwordHash,
    firstName,
    lastName,
  });
  await user.save();

  res.json({
    _id: user._id,
  });
};
