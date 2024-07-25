import { NextFunction, Request, Response } from "express";
export interface IUserControllerImpl{
    getUserWalletAmount(req: Request, res: Response): Promise<Response>
}