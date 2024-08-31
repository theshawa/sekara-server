import { TopicModel } from "../../models/topic.js";

export const getTopics = async (req, res) => {
  // get all topics
  const topics = await TopicModel.find().sort({ title: 1 });

  res.json(topics);
};
