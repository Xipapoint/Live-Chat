import { Router } from "express";
// import {userRouter} from './userRouter'
import { authRouter } from "./authRouter";
export const router = Router();

router.use('/auth', authRouter)