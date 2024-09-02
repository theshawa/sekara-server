import fs from "fs";
import Joi from "joi";
import { USER_ROLES } from "../../globals.js";
import { AppError } from "../../lib/error.js";
import { ArticleModel } from "../../models/article.js";
import { TopicModel } from "../../models/topic.js";
import { UserModel } from "../../models/user.js";
import { mongoBucket } from "../../server.js";

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
    let uploadStream = mongoBucket.openUploadStream(req.file.filename, {
      metadata: {
        type: "featuredImage",
        article: article._id,
        contentType: req.file.mimetype,
      },
      contentType: req.file.mimetype,
    });

    const readStream = fs.createReadStream(req.file.path);

    await new Promise((resolve, reject) => {
      readStream
        .pipe(uploadStream)
        .on("finish", resolve("successfull"))
        .on("error", reject("error occured while creating stream"));
    });

    article.featuredImage = uploadStream.id;
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
