import { UserModel } from "../../models/user.js";

export const deleteUser = async (req, res) => {
  const currentUser = new UserModel(req.user);

  // TODO: check if user has articles and comments and delete those articles

  await currentUser.deleteOne();

  res.sendStatus(200);
};
