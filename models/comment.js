import mongoose from "mongoose";

// title, content, topic, and createdBy are required
// claps is a number with a default value of 0
// hidden is a boolean with a default value of false
// createdAt and updatedAt are date fields with default values
export const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
    required: true,
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
});

export const CommentModel = mongoose.model("Comment", CommentSchema);
