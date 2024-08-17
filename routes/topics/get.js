import { TopicModel } from "../../models/topic.js";

export const getTopics = async (req, res) => {
  const topics = await TopicModel.find();
  res.json(topics);
};
