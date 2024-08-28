import { CommentModel } from "../../models/comment.js";

export const getComments = async (req, res) => {
  const articleId = req.query.article;
  const userId = req.query.user;
  const parentId = req.query.parent;

  if (!articleId && !userId && !parentId) {
    throw new AppError(400, "no query parameters provided");
  }

  const options = {
    hidden: false,
  };

  if (parentId) {
    options.parent = parentId;
  }
  if (articleId) {
    options.article = articleId;
  }
  if (userId) {
    options.createdBy = userId;
  }

  // get query parameters
  const { page, limit } = req.query;

  // get articles and populate createdBy and topic fields
  const comments = await CommentModel.find(options)
    .limit(limit || 10)
    .skip(page && limit ? page * limit : 0) // page should start from 0
    .populate("createdBy", "firstName lastName _id")
    .sort({ createdAt: 1 })
    .exec();

  res.json(comments);
};
