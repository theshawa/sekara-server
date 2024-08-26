import { ArticleModel } from "../../models/article.js";
import { UserModel } from "../../models/user.js";

export const deleteUser = async (req, res) => {
  // create user model instance
  const currentUser = new UserModel(req.user);

  // delete user articles
  await ArticleModel.deleteMany({
    createdBy: currentUser._id,
  });

  // delete user
  await currentUser.deleteOne();

  res.sendStatus(200);
};
