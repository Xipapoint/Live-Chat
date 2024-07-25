// import { AppDataSource } from '../dataSource';
// import { IUserServiceImpl } from '../services/impl/userServiceImpl';
// import { IUserControllerImpl } from "./impl/userControllerImpl";
// import { NextFunction, Request, Response } from "express";
// import UserService from '../services/userService';

// class UserController implements IUserControllerImpl{
//     private userService: IUserServiceImpl
//     constructor(userService: IUserServiceImpl){
//         this.userService = userService
//     }
//     async getUserWalletAmount(req: Request, res: Response): Promise<Response> {
//         const token = req.cookies.refreshToken;
        
//         if (!token) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }

//         try {
//             const walletAmount: number | null = await this.userService.getUserWalletAmount(token);
//             if (walletAmount !== null && walletAmount < 2) {
//                 return res.status(200);
//             } else {
//                 return res.status(400);
//             }
//         } catch (error) {
//             return res.status(500).json({ message: error });
//         }
//     }

// }

// export default new UserController(UserService);