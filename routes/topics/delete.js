import { AppError } from "../../lib/error.js";
import { ArticleModel } from "../../models/article.js";
import { TopicModel } from "../../models/topic.js";

export const deleteTopic = async (req, res) => {
  const { id } = req.params;

  // check if topic exists
  const currentTopic = await TopicModel.findById(id);
  if (!currentTopic) {
    throw new AppError(404, "topic not found");
  }

  // check if topic has articles
  const articles = await ArticleModel.find({ topic: currentTopic._id });
  if (articles.length > 0) {
    throw new AppError(400, "topic has articles");
  }

  // delete topic
  await currentTopic.deleteOne();

  res.sendStatus(200);
};
