import { AppError } from "../../lib/error.js";
import { ArticleModel } from "../../models/article.js";

export const toggleArticleHidden = async (req, res) => {
  const id = req.params.id;

  // check if article exists
  const article = await ArticleModel.findById(id);
  if (!article) {
    throw new AppError(404, "Article not found");
  }

  article.hidden = !article.hidden;

  await article.save();

  res.json({
    hidden: article.hidden,
  });
};
