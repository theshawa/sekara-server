import Joi from "joi";
import { AppError } from "../../lib/error.js";
import { UserModel } from "../../models/user.js";

// request body validation schema
const bodySchema = Joi.object({
  firstName: Joi.string().required().label("First Name"),
  lastName: Joi.string().allow("").label("Last Name"),
  description: Joi.string().allow("").label("Description"),
});

export const updateUserProfile = async (req, res) => {
  // validate request body
  const { value, error } = bodySchema.validate(req.body);
  if (error) {
    throw new AppError(400, error.message || "invalid body");
  }

  const { firstName, lastName, description } = value;

  // update user profile
  const currentUser = new UserModel(req.user);
  currentUser.firstName = firstName;
  currentUser.lastName = lastName;
  currentUser.description = description;
  currentUser.updatedAt = Date.now();
  await currentUser.save();

  res.sendStatus(200);
};
