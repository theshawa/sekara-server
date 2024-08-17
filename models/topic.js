import mongoose from "mongoose";

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
