import { Router } from "express";
import { USER_ROLES } from "../../globals.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { createArticle } from "./create.js";

export const articlesRouter = Router();

articlesRouter.post(
  "/create",
  authMiddleware(USER_ROLES.admin, USER_ROLES.user, USER_ROLES.user_writer),
  createArticle
);
