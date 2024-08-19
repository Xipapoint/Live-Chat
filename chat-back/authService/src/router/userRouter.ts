import { Router } from "express";
import UserController from "../controllers/userController";

export const userRouter = Router();

userRouter.get('/names/:userId', UserController.getNamesById);
