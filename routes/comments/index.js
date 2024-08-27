import { Router } from "express";
import { USER_ROLES } from "../../globals.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { createComment } from "./create.js";
import { deleteComment } from "./delete.js";
import { getComments } from "./get.js";

export const commentsRouter = Router();

commentsRouter.get("/", getComments);
commentsRouter.post(
  "/create",
  authMiddleware(USER_ROLES.admin, USER_ROLES.user, USER_ROLES.user_writer),
  createComment
);
commentsRouter.delete(
  "/:id",
  authMiddleware(USER_ROLES.admin, USER_ROLES.user, USER_ROLES.user_writer),
  deleteComment
);
