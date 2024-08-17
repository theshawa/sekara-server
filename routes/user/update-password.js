import Joi from "joi";
import { comparePassword, encryptPassword } from "../../helpers/bcrypt.js";
import { AppError } from "../../lib/error.js";
import { UserModel } from "../../models/user.js";

const bodySchema = Joi.object({
  newPassword: Joi.string().min(6).required().label("New Password"),
  currentPassword: Joi.string().required().label("Current Password"),
});

export const updateUserPassword = async (req, res) => {
  const { value, error } = bodySchema.validate(req.body);
  if (error) {
    throw new AppError(400, error.message || "invalid body");
  }

  const { newPassword, currentPassword } = value;

  const currentUser = new UserModel(req.user);

  const passwordOkay = await comparePassword(
    currentPassword,
    currentUser.password
  );
  if (!passwordOkay) {
    throw new AppError(400, "invalid current password");
  }

  const newPasswordHash = await encryptPassword(newPassword);

  currentUser.password = newPasswordHash;
  currentUser.updatedAt = Date.now();
  await currentUser.save();

  res.sendStatus(200);
};
