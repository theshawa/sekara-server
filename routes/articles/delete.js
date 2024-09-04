import { deleteAsset } from "../../helpers/assets.js";
import { AppError } from "../../lib/error.js";
import { ArticleModel } from "../../models/article.js";
import { CommentModel } from "../../models/comment.js";

export const deleteArticle = async (req, res) => {
  const { id } = req.params;

  // check if article exists
  const currentArticle = await ArticleModel.findById(id);
  if (!currentArticle) {
    throw new AppError(404, "Article not found");
  }

  // check if user is allowed to delete article
  if (currentArticle.createdBy.toString() !== req.user._id.toString()) {
    throw new AppError(400, "You are not allowed to delete this article");
  }

  // delete comments
  await CommentModel.deleteMany({ article: currentArticle._id });

  // delete featured image if exists
  if (currentArticle.featuredImage) {
    await deleteAsset(currentArticle.featuredImage);
  }

  // delete article
  await currentArticle.deleteOne();

  res.sendStatus(200);
};
