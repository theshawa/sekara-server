import { UserModel } from "../../models/user.js";

export const getUser = async (req, res) => {
  const id = req.params.id;
  const user = await UserModel.findById(id);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  res.json({
    ...user.toObject(),
    password: undefined,
    __v: undefined,
  });
};
