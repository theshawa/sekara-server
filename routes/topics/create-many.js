import Joi from "joi";
import { AppError } from "../../lib/error.js";
import { TopicModel } from "../../models/topic.js";

// request body validation schema
const bodySchema = Joi.object({
  titles: Joi.array().required().label("Titles"),
});

export const createManyTopics = async (req, res) => {
  // validate request body
  const { value, error } = bodySchema.validate(req.body);
  if (error) {
    throw new AppError(400, error.message || "invalid body");
  }

  const { titles } = value;

  // create topics
  const topics = await TopicModel.insertMany(
    titles.map((title) => ({ title }))
  );

  res.json({
    topics,
  });
};
