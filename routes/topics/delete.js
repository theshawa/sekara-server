import { AppError } from "../../lib/error.js";
import { TopicModel } from "../../models/topic.js";

export const deleteTopic = async (req, res) => {
  const { id } = req.params;

  const currentTopic = await TopicModel.findById(id);
  if (!currentTopic) {
    throw new AppError(404, "topic not found");
  }

  if (currentTopic.articles.length > 0) {
    throw new AppError(400, "topic has articles");
  }

  await currentTopic.deleteOne();

  res.sendStatus(200);
};
