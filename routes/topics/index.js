import { Router } from "express";
import { USER_ROLES } from "../../globals.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { createManyTopics } from "./create-many.js";
import { createTopic } from "./create.js";
import { deleteTopic } from "./delete.js";
import { getTopics } from "./get.js";
import { updateTopic } from "./update.js";

export const topicsRouter = Router();

topicsRouter.post("/create", authMiddleware(USER_ROLES.admin), createTopic);
topicsRouter.post(
  "/create-many",
  authMiddleware(USER_ROLES.admin),
  createManyTopics
);
topicsRouter.get("/", getTopics);
topicsRouter.put("/:id", updateTopic);
topicsRouter.delete("/:id", deleteTopic);
