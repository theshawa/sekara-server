import Joi from "joi";
import { AppError } from "../../lib/error.js";
import { ArticleModel } from "../../models/article.js";
import { TopicModel } from "../../models/topic.js";

const bodySchema = Joi.object({
  title: Joi.string().required().label("Title"),
  topic: Joi.string().required().label("Topic Id"),
  content: Joi.string().required().label("Content"),
});

export const createArticle = async (req, res) => {
  const { value, error } = bodySchema.validate(req.body);
  if (error) {
    throw new AppError(400, error.message || "invalid body");
  }

  const { title, topic: topicId, content } = value;

  const topic = await TopicModel.findById(topicId);
  if (!topic) {
    throw new AppError(404, "Topic not found");
  }

  const article = new ArticleModel({
    title,
    content,
    topic: topicId,
    createdBy: req.user._id,
  });

  // update user role(user -> writer)

  await article.save();
  await topic.updateOne({ $inc: { articles: 1 } });

  res.json({
    _id: article._id,
  });
};
