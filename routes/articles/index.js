import { Router } from "express";
import { USER_ROLES } from "../../globals.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { bookmarkArticle } from "./bookmark.js";
import { clapArticle } from "./clap.js";
import { createArticle } from "./create.js";
import { deleteArticle } from "./delete.js";
import { getBookmarks } from "./get-bookmarks.js";
import { getArticles } from "./get-many.js";
import { getArticle } from "./get.js";
import { updateArticle } from "./update.js";

export const articlesRouter = Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/one/:id", getArticle);
articlesRouter.get(
  "/bookmarks",
  authMiddleware(USER_ROLES.admin, USER_ROLES.user, USER_ROLES.user_writer),
  getBookmarks
);
articlesRouter.post(
  "/create",
  authMiddleware(USER_ROLES.admin, USER_ROLES.user, USER_ROLES.user_writer),
  createArticle
);
articlesRouter.post(
  "/update/:id",
  authMiddleware(USER_ROLES.admin, USER_ROLES.user, USER_ROLES.user_writer),
  updateArticle
);
articlesRouter.post(
  "/clap/:id",
  authMiddleware(USER_ROLES.admin, USER_ROLES.user, USER_ROLES.user_writer),
  clapArticle
);
articlesRouter.post(
  "/bookmark/:id",
  authMiddleware(USER_ROLES.admin, USER_ROLES.user, USER_ROLES.user_writer),
  bookmarkArticle
);
articlesRouter.delete(
  "/:id",
  authMiddleware(USER_ROLES.admin, USER_ROLES.user, USER_ROLES.user_writer),
  deleteArticle
);
