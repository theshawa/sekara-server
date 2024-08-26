import Joi from "joi";
import { comparePassword } from "../../helpers/bcrypt.js";
import { jwtSign } from "../../helpers/jwt.js";
import { AppError } from "../../lib/error.js";
import { UserModel } from "../../models/user.js";

// request body validation schema
const bodySchema = Joi.object({
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().required().label("Password"),
});

export const signInUser = async (req, res) => {
  // validate request body
  const { value, error } = bodySchema.validate(req.body);
  if (error) {
    throw new AppError(400, error.message || "invalid body");
  }

  const { email, password } = value;

  // check if user exists
  const currentUser = await UserModel.findOne({ email });
  if (!currentUser) {
    throw new AppError(404, "user not found");
  }

  // check if password is correct
  const passwordOkay = await comparePassword(password, currentUser.password);
  if (!passwordOkay) {
    throw new AppError(401, "invalid password");
  }

  // generate jwt token
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
