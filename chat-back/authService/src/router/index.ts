import { Router } from "express";
// import {userRouter} from './userRouter'
import { authRouter } from "./authRouter";
import { userRouter } from "./userRouter";
export const router = Router();

router.use('/auth', authRouter)
router.use('/user', userRouter)