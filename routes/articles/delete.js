import { AppError } from "../../lib/error.js";
import { ArticleModel } from "../../models/article.js";
import { CommentModel } from "../../models/comment.js";
import { TopicModel } from "../../models/topic.js";

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

  // delete article
  await currentArticle.deleteOne();
  await CommentModel.deleteMany({ article: currentArticle._id });
  await TopicModel.updateOne(
    { _id: currentArticle.topic },
    { $inc: { articles: -1 } }
  );

  res.sendStatus(200);
};
