import { NextFunction, Request, Response } from "express";
export interface IUserControllerImpl{
    getNamesById(req: Request, res: Response, next: NextFunction): Promise<Response | void>
}