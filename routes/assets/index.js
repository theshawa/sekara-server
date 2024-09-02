import { Router } from "express";
import { getAsset } from "./get.js";

export const assetsRouter = Router();

assetsRouter.get("/:id", getAsset);
