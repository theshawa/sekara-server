import { AppError } from "../../lib/error.js";
import { ArticleModel } from "../../models/article.js";

export const clapArticle = async (req, res) => {
  const id = req.params.id;

  // check if article exists
  const article = await ArticleModel.findById(id);
  if (!article) {
    throw new AppError(404, "Article not found");
  }

  if (req.user._id.toString() === article.createdBy.toString()) {
    throw new AppError(400, "You can't clap your own article");
  }

  // increment claps count
  await article.updateOne({ $inc: { claps: 1 } });

  res.sendStatus(200);
};
