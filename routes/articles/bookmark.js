import { AppError } from "../../lib/error.js";
import { ArticleModel } from "../../models/article.js";

export const bookmarkArticle = async (req, res) => {
  const id = req.params.id;

  // check if article exists
  const article = await ArticleModel.findById(id);
  if (!article) {
    throw new AppError(404, "Article not found");
  }

  let bookmarked;
  if (article.bookmarkedBy.includes(req.user._id)) {
    // unbookmark article
    await article.updateOne({ $pull: { bookmarkedBy: req.user._id } });
    bookmarked = false;
  } else {
    // bookmark article
    await article.updateOne({ $push: { bookmarkedBy: req.user._id } });
    bookmarked = true;
  }

  res.json({
    bookmarked,
  });
};
