import { USER_ROLES } from "../../globals.js";
import { deleteAsset } from "../../helpers/assets.js";
import { AppError } from "../../lib/error.js";
import { ArticleModel } from "../../models/article.js";
import { CommentModel } from "../../models/comment.js";
import { UserModel } from "../../models/user.js";

export const deleteUser = async (req, res) => {
  // create user model instance
  const currentUser = new UserModel(req.user);

  if (currentUser.role === USER_ROLES.admin) {
    throw new AppError(400, "Admin cannot delete their account");
  }

  // delete user comments
  await CommentModel.deleteMany({
    createdBy: currentUser._id,
  });

  const userArticles = await ArticleModel.find({
    createdBy: currentUser._id,
  });

  // delete user articles images
  const imageDeletePromises = userArticles
    .map((article) => article.featuredImage)
    .filter((im) => im !== null)
    .map((id) => deleteAsset(id));
  await Promise.all(imageDeletePromises);

  // delete user articles
  await ArticleModel.deleteMany({
    createdBy: currentUser._id,
  });

  // delete user
  await currentUser.deleteOne();

  res.sendStatus(200);
};
