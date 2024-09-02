import Joi from "joi";
import { USER_ROLES } from "../../globals.js";
import { uploadAsset } from "../../helpers/assets.js";
import { AppError } from "../../lib/error.js";
import { ArticleModel } from "../../models/article.js";
import { TopicModel } from "../../models/topic.js";
import { UserModel } from "../../models/user.js";

// request body validation schema
const bodySchema = Joi.object({
  title: Joi.string().required().label("Title"),
  topic: Joi.string().required().label("Topic Id"),
  content: Joi.string().required().label("Content"),
});

export const createArticle = async (req, res) => {
  // validate request body
  const { value, error } = bodySchema.validate(req.body);
  if (error) {
    throw new AppError(400, error.message || "invalid body");
  }

  const { title, topic: topicId, content } = value;

  // check if topic exists
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

  if (req.file) {
    article.featuredImage = await uploadAsset({
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      path: req.file.path,
      metadata: {
        type: "featuredImage",
        article: article._id,
      },
    });
  }

  // if user is a regular user, upgrade to writer
  if (req.user.role === USER_ROLES.user) {
    const user = new UserModel(req.user);
    await user.updateOne({ role: USER_ROLES.user_writer });
  }

  // save article and update topic articles count
  await article.save();
  await topic.updateOne({ $inc: { articles: 1 } });

  res.json({
    _id: article._id,
  });
};
