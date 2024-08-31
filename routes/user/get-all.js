import { USER_ROLES } from "../../globals.js";
import { UserModel } from "../../models/user.js";

export const getAllUsers = async (req, res) => {
  const users = await UserModel.find({
    role: { $ne: USER_ROLES.admin },
  }).sort({ firstName: 1, lastName: 1 });

  res.json(
    users.map((user) => ({
      ...user.toObject(),
      password: undefined,
      __v: undefined,
      deactivated: user.deactivated === undefined ? false : user.deactivated,
    }))
  );
};
