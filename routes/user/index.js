import { Router } from "express";
import { USER_ROLES } from "../../globals.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { deleteUser } from "./delete.js";
import { getUser } from "./get.js";
import { signInUser } from "./sign-in.js";
import { signUpUser } from "./sign-up.js";
import { updateUserPassword } from "./update-password.js";
import { updateUserProfile } from "./update-profile.js";

export const userRouter = Router();

userRouter.post("/sign-up", signUpUser);
userRouter.post("/sign-in", signInUser);
userRouter.put(
  "/update-profile",
  authMiddleware(USER_ROLES.user, USER_ROLES.user_writer, USER_ROLES.admin),
  updateUserProfile
);
userRouter.put(
  "/update-password",
  authMiddleware(USER_ROLES.user, USER_ROLES.user_writer, USER_ROLES.admin),
  updateUserPassword
);
userRouter.delete(
  "/",
  authMiddleware(USER_ROLES.user, USER_ROLES.user_writer, USER_ROLES.admin),
  deleteUser
);
userRouter.get("/:id", getUser);
