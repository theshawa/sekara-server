import Joi from "joi";
import { comparePassword } from "../../helpers/bcrypt.js";
import { jwtSign } from "../../helpers/jwt.js";
import { AppError } from "../../lib/error.js";
import { UserModel } from "../../models/user.js";

const bodySchema = Joi.object({
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().required().label("Password"),
});

export const signInUser = async (req, res) => {
  const { value, error } = bodySchema.validate(req.body);
  if (error) {
    throw new AppError(400, error.message || "invalid body");
  }

  const { email, password } = value;

  const currentUser = await UserModel.findOne({ email });
  if (!currentUser) {
    throw new AppError(404, "user not found");
  }

  const passwordOkay = await comparePassword(password, currentUser.password);
  if (!passwordOkay) {
    throw new AppError(401, "invalid password");
  }

  const token = await jwtSign(currentUser._id);

  res.json({
    token,
    user: {
      _id: currentUser._id,
      email: currentUser.email,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      role: currentUser.role,
      description: currentUser.description,
    },
  });
};
