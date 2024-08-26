import mongoose from "mongoose";

// title is required, unique, and case-insensitive
// articles is a number with a default value of 0
// createdAt and updatedAt are date fields with default values
export const TopicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  articles: {
    type: Number,
    default: 0,
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

export const TopicModel = mongoose.model("Topic", TopicSchema);
