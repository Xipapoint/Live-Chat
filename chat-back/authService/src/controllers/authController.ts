import { NextFunction, Request, Response } from "express";
import { IRegiterUserRequestDto } from "../dto/request/RegisterUserRequestDTO.dto";
import IAuthServiceImpl from "../service/impl/authServiceImpl";
import authService from "../service/authService";

class AuthController{
    private authService: IAuthServiceImpl;
    constructor( authService: IAuthServiceImpl){
        this.authService = authService;
    }
    async registration(req: Request<{}, {}, IRegiterUserRequestDto>, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const userData: IRegiterUserRequestDto = req.body;
            const tokens = await authService.registrationService(userData);
            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(tokens);
        } catch (error) {
            return next(error);
        }
    }
}

export default new AuthController(authService);