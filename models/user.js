import mongoose from "mongoose";
import { USER_ROLES } from "../globals.js";

// firstName, lastName, email, and password are required
// email must be unique
// role must be one of the values in USER_ROLES
// createdAt and updatedAt are automatically generated
// description is an optional field
export const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.user,
  },
  password: {
    type: String,
    required: true,
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

export const UserModel = mongoose.model("User", UserSchema);
