import Joi from "joi";
import { AppError } from "../../lib/error.js";
import { TopicModel } from "../../models/topic.js";

const bodySchema = Joi.object({
  title: Joi.string().required().label("Title"),
});

export const updateTopic = async (req, res) => {
  const { value, error } = bodySchema.validate(req.body);
  if (error) {
    throw new AppError(400, error.message || "invalid body");
  }

  const { id } = req.params;
  const { title } = value;

  const currentTopic = await TopicModel.findById(id);
  if (!currentTopic) {
    throw new AppError(404, "topic not found");
  }

  currentTopic.title = title;
  currentTopic.updatedAt = Date.now();
  await currentTopic.save();

  res.sendStatus(200);
};
