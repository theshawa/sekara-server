import { ArticleModel } from "../../models/article.js";
import { CommentModel } from "../../models/comment.js";
import { UserModel } from "../../models/user.js";

export const forceDeleteUser = async (req, res) => {
  const id = req.params.id;
  // create user model instance
  const currentUser = await UserModel.findById(id);
  if (!currentUser) {
    throw new AppError(404, "User not found");
  }

  // delete user comments
  await CommentModel.deleteMany({
    createdBy: currentUser._id,
  });

  // delete user articles
  await ArticleModel.deleteMany({
    createdBy: currentUser._id,
  });

  // delete user
  await currentUser.deleteOne();

  res.sendStatus(200);
};
