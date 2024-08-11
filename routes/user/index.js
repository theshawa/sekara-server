import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.js";
import { userLogin } from "./login.js";
import { userRegister } from "./register.js";
import { userUpdatePassword } from "./update-password.js";

export const userRouter = Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.post("/update-password", authMiddleware("user"), userUpdatePassword);
