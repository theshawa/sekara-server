import Joi from "joi";
import { comparePassword, hashPassword } from "../../helpers/bcrypt.js";
import { AppError } from "../../lib/error.js";
import { UserModel } from "../../models/user.js";

// request body validation schema
const bodySchema = Joi.object({
  newPassword: Joi.string().min(6).required().label("New Password"),
  currentPassword: Joi.string().required().label("Current Password"),
});

export const updateUserPassword = async (req, res) => {
  // validate request body
  const { value, error } = bodySchema.validate(req.body);
  if (error) {
    throw new AppError(400, error.message || "invalid body");
  }

  const { newPassword, currentPassword } = value;

  // create user model instance
  const currentUser = new UserModel(req.user);

  // check if current password is correct
  const passwordOkay = await comparePassword(
    currentPassword,
    currentUser.password
  );
  if (!passwordOkay) {
    throw new AppError(400, "invalid current password");
  }

  // encrypt new password
  const newPasswordHash = await hashPassword(newPassword);

  // update password
  currentUser.password = newPasswordHash;
  currentUser.updatedAt = Date.now();
  await currentUser.save();

  res.sendStatus(200);
};
