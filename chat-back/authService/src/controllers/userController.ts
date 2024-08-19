// import { AppDataSource } from '../dataSource';
import { IUserServiceImpl } from '../service/impl/userServiceImpl';
import { IUserControllerImpl } from "./impl/userControllerImpl";
import { NextFunction, Request, Response } from "express";
import UserService from '../service/userService';
import { IGetUserNamesResponseDTO } from '../dto/response/GetUserNamesResponseDTO';

class UserController implements IUserControllerImpl{
    async getNamesById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const {userId} = req.params
            const names = await UserService.getNamesById(userId)
            const firstName = names.secondFirstName
            const lastName = names.secondLastName
            return res.json({firstName, lastName})
        } catch (error) {
            next(error)
        }
    }


}

export default new UserController();