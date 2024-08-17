import Joi from "joi";
import { AppError } from "../../lib/error.js";
import { TopicModel } from "../../models/topic.js";

const bodySchema = Joi.object({
  title: Joi.string().required().label("Title"),
});

export const createTopic = async (req, res) => {
  const { value, error } = bodySchema.validate(req.body);
  if (error) {
    throw new AppError(400, error.message || "invalid body");
  }

  const { title } = value;

  const topic = new TopicModel({ title });
  await topic.save();

  res.json({
    _id: topic._id,
  });
};
