import Joi from "joi";
import { AppError } from "../../lib/error.js";
import { UserModel } from "../../models/user.js";

const bodySchema = Joi.object({
  newPassword: Joi.string().required(),
  currentPassword: Joi.string().required(),
});

export const userUpdatePassword = async (req, res) => {
  const { value, error } = bodySchema.validate(req.body);
  if (error) {
    throw new AppError(400, error.message || "invalid body");
  }

  const { newPassword, currentPassword } = value;

  const currentUser = new UserModel(req.user);

  const passwordOkay = await currentUser.comparePassword(currentPassword);
  if (!passwordOkay) {
    throw new AppError(401, "invalid current password");
  }

  currentUser.password = newPassword;
  currentUser.updatedAt = Date.now();
  await currentUser.save();

  res.sendStatus(200);
};
