import { Router } from "express";
import { USER_ROLES } from "../../globals.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { clapArticle } from "./clap.js";
import { createArticle } from "./create.js";
import { getArticles } from "./get-many.js";
import { getArticle } from "./get.js";

export const articlesRouter = Router();

articlesRouter.get("/", getArticles);
articlesRouter.post(
  "/create",
  authMiddleware(USER_ROLES.admin, USER_ROLES.user, USER_ROLES.user_writer),
  createArticle
);
articlesRouter.get("/:id", getArticle);
articlesRouter.post(
  "/clap/:id",
  authMiddleware(USER_ROLES.admin, USER_ROLES.user, USER_ROLES.user_writer),
  clapArticle
);
