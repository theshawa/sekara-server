import { AppError } from "../../lib/error.js";
import { ArticleModel } from "../../models/article.js";

export const getArticle = async (req, res) => {
  const id = req.params.id;

  // get article by id and populate createdBy and topic fields
  const article = await ArticleModel.findById(id)
    .populate("createdBy", "firstName lastName _id")
    .populate("topic", "title _id")
    .exec();
  if (!article) {
    throw new AppError(404, "article not found");
  }

  // check if article is hidden
  if (article.hidden) {
    throw new AppError(404, "article not found");
  }

  res.json(article);
};
