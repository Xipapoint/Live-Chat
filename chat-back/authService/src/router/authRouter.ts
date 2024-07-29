import { Router } from "express";
import AuthController from "../controllers/authController";

export const authRouter = Router();

authRouter.post('/register', AuthController.registration)
authRouter.post('/login', AuthController.login)
authRouter.post('/refresh', AuthController.refresh)