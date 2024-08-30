import { AppError } from "../../lib/error.js";
import { ArticleModel } from "../../models/article.js";
import { CommentModel } from "../../models/comment.js";

export const deleteComment = async (req, res) => {
  const { id } = req.params;

  // check if comment exists
  const currentComment = await CommentModel.findById(id);

  if (!currentComment) {
    throw new AppError(404, "Comment not found");
  }

  // check if user is allowed to delete comment
  if (currentComment.createdBy.toString() !== req.user._id.toString()) {
    throw new AppError(400, "You are not allowed to delete this comment");
  }

  // delete comment and update article comments count
  await currentComment.deleteOne();
  await ArticleModel.updateOne(
    { _id: currentComment.article },
    { $inc: { comments: -1 } }
  );

  res.sendStatus(200);
};
