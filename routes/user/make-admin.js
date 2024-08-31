import { USER_ROLES } from "../../globals.js";
import { AppError } from "../../lib/error.js";
import { ArticleModel } from "../../models/article.js";
import { UserModel } from "../../models/user.js";

export const makeUserAdmin = async (req, res) => {
  const id = req.params.id;

  // check if user exists
  const newUser = await UserModel.findById(id);
  if (!newUser) {
    throw new AppError(404, "User not found");
  }

  if (newUser.deactivated) {
    throw new AppError(400, "User is deactivated");
  }

  const currentUser = new UserModel(req.user);

  // check if current admin has articles and assign new role
  const articles = await ArticleModel.find({ createdBy: currentUser._id });
  if (articles.length) {
    currentUser.role = USER_ROLES.user_writer;
  } else {
    currentUser.role = USER_ROLES.user;
  }

  newUser.role = USER_ROLES.admin;

  await newUser.save();
  await currentUser.save();

  res.sendStatus(200);
};
