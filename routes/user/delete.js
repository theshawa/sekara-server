import { ArticleModel } from "../../models/article.js";
import { CommentModel } from "../../models/comment.js";
import { UserModel } from "../../models/user.js";
import { mongoBucket } from "../../server.js";

export const deleteUser = async (req, res) => {
  // create user model instance
  const currentUser = new UserModel(req.user);

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
    .map((id) => mongoBucket.delete(id));
  await Promise.all(imageDeletePromises);

  // delete user articles
  await ArticleModel.deleteMany({
    createdBy: currentUser._id,
  });

  // delete user
  await currentUser.deleteOne();

  res.sendStatus(200);
};
