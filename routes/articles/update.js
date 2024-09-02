import Joi from "joi";
import { deleteAsset, uploadAsset } from "../../helpers/assets.js";
import { AppError } from "../../lib/error.js";
import { ArticleModel } from "../../models/article.js";
import { TopicModel } from "../../models/topic.js";

// request body validation schema
const bodySchema = Joi.object({
  title: Joi.string().required().label("Title"),
  topic: Joi.string().required().label("Topic Id"),
  content: Joi.string().required().label("Content"),
  featuredImage: Joi.string().allow(null).label("Featured Image"),
});

export const updateArticle = async (req, res) => {
  const id = req.params.id;
  // validate request body
  const { value, error } = bodySchema.validate(req.body);
  if (error) {
    throw new AppError(400, error.message || "invalid body");
  }

  const { title, topic: topicId, content, featuredImage } = value;

  const article = await ArticleModel.findById(id);
  if (!article) {
    throw new AppError(404, "Article not found");
  }

  // check if user is allowed to update article
  if (article.createdBy.toString() !== req.user._id.toString()) {
    throw new AppError(400, "You are not allowed to update this article");
  }

  let deleteImage = null;
  if (featuredImage === null || typeof featuredImage === "string") {
    if (article.featuredImage && featuredImage === null) {
      deleteImage = article.featuredImage;
    }
    article.featuredImage = featuredImage;
  } else {
    deleteImage = article.featuredImage;
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
  }

  if (deleteImage) {
    await deleteAsset(deleteImage);
  }

  article.title = title;
  article.content = content;
  // check if topic is changed and update topic articles count accordingly
  if (article.topic !== topicId) {
    await TopicModel.updateOne({ _id: topicId }, { $inc: { articles: 1 } });
    await TopicModel.updateOne(
      { _id: article.topic },
      { $inc: { articles: -1 } }
    );
  }
  article.topic = topicId;
  article.updatedAt = new Date();

  await article.save();

  res.sendStatus(200);
};
