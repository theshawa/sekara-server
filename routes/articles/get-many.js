import { ArticleModel } from "../../models/article.js";

export const getArticles = async (req, res) => {
  // set hidden to false as not hidden articles should be returned
  const options = {};

  // get query parameters
  const { page, limit, query, topic, createdBy } = req.query;

  if (topic) {
    options.topic = topic;
  }

  if (createdBy) {
    options.createdBy = createdBy;
  }

  // search by title
  if (query) {
    const regex = new RegExp(query, "i");
    options.title = regex;
  }

  // get articles and populate createdBy and topic fields
  const articles = await ArticleModel.find(options)
    .limit(limit || 10)
    .skip((page || 0) * (limit || 10)) // page should start from 0
    .populate("createdBy", "firstName lastName _id")
    .populate("topic", "title _id")
    .sort({ createdAt: -1 })
    .exec();

  // get total count of articles
  const totalCount = await ArticleModel.countDocuments(options);

  res.json({ articles, totalCount });
};
