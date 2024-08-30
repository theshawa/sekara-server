import { ArticleModel } from "../../models/article.js";

export const getBookmarks = async (req, res) => {
  // get articles that are bookmarked by the user
  const articles = await ArticleModel.find({
    bookmarkedBy: {
      $in: [req.user._id],
    },
    hidden: false,
  })
    .populate("createdBy", "firstName lastName _id")
    .populate("topic", "title _id")
    .sort({ createdAt: -1 })
    .exec();

  res.json(articles);
};
