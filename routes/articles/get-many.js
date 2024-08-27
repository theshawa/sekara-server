import { ArticleModel } from "../../models/article.js";

export const getArticles = async (req, res) => {
  // set hidden to false as not hidden articles should be returned
  const options = {
    hidden: false,
  };

  // get query parameters
  const { page, limit, query, topic } = req.query;

  if (topic) {
    options.topic = topic;
  }

  // search by title
  if (query) {
    const regex = new RegExp(query, "i");
    options.title = regex;
  }

  // get articles and populate createdBy and topic fields
  const articles = await ArticleModel.find(options)
    .limit(limit)
    .skip(page * limit) // page should start from 0
    .populate("createdBy", "firstName lastName _id")
    .populate("topic", "title _id")
    .exec();

  res.json(articles);
};
