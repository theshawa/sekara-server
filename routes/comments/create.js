import Joi from "joi";
import { AppError } from "../../lib/error.js";
import { ArticleModel } from "../../models/article.js";
import { CommentModel } from "../../models/comment.js";

// request body validation schema
const bodySchema = Joi.object({
  content: Joi.string().required().label("Content"),
  article: Joi.string().required().label("Article"),
});

export const createComment = async (req, res) => {
  // validate request body
  const { value, error } = bodySchema.validate(req.body);
  if (error) {
    throw new AppError(400, error.message || "invalid body");
  }

  const { content, article: articleId } = value;

  // check if article exists
  const article = await ArticleModel.findById(articleId);
  if (!article) {
    throw new AppError(404, "Article not found");
  }

  const comment = new CommentModel({
    content,
    createdBy: req.user._id,
    article: articleId,
  });

  // save comment and update article comments count
  await comment.save();
  await article.updateOne({ $inc: { comments: 1 } });

  res.json({
    ...comment.toObject(),
    createdBy: {
      _id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
    },
  });
};
