import mongoose from "mongoose";

// title, content, topic, and createdBy are required
// claps is a number with a default value of 0
// hidden is a boolean with a default value of false
// createdAt and updatedAt are date fields with default values
export const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  claps: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Number,
    default: 0,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  bookmarkedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  featuredImage: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
});

export const ArticleModel = mongoose.model("Article", ArticleSchema);
