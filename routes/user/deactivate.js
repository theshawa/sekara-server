import { UserModel } from "../../models/user.js";

export const deactivateUser = async (req, res) => {
  const id = req.params.id;

  // create user model instance
  const currentUser = await UserModel.findById(id);
  if (!currentUser) {
    throw new AppError(404, "User not found");
  }

  // deactivate user
  currentUser.deactivated = !currentUser.deactivated;
  await currentUser.save();

  res.json({ deactivated: currentUser.deactivated });
};
