import { Router } from "express";
import { USER_ROLES } from "../../globals.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { deactivateUser } from "./deactivate.js";
import { deleteUser } from "./delete.js";
import { forceDeleteUser } from "./force-delete.js";
import { getAllUsers } from "./get-all.js";
import { getUser } from "./get.js";
import { makeUserAdmin } from "./make-admin.js";
import { signInUser } from "./sign-in.js";
import { signUpUser } from "./sign-up.js";
import { updateUserPassword } from "./update-password.js";
import { updateUserProfile } from "./update-profile.js";
import { validateUserToken } from "./validate-token.js";

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
userRouter.delete("/:id", authMiddleware(USER_ROLES.admin), forceDeleteUser);
userRouter.get("/:id", getUser);
userRouter.get("/", authMiddleware(USER_ROLES.admin), getAllUsers);
userRouter.post("/validate-token", validateUserToken);
userRouter.post(
  "/deactivate/:id",
  authMiddleware(USER_ROLES.admin),
  deactivateUser
);
userRouter.post(
  "/make-admin/:id",
  authMiddleware(USER_ROLES.admin),
  makeUserAdmin
);
