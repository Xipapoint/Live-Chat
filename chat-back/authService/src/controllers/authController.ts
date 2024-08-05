import { NextFunction, Request, Response } from "express";
import { IRegiterUserRequestDto } from "../dto/request/RegisterUserRequestDTO.dto";
import IAuthServiceImpl from "../service/impl/authServiceImpl";
import authService from "../service/authService";
import tokenService from "../service/tokenService";
import { ILoginUserRequestDto } from "../dto/request/LoginUserRequestDTO.dto";
import { IJwtUserResponseDto } from "../dto/response/JwtUserResponseDTO.dto";

class AuthController{
    private authService: IAuthServiceImpl;
    constructor( authService: IAuthServiceImpl){
        this.authService = authService;
    }
    async registration(req: Request<{}, {}, IRegiterUserRequestDto>, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const userData: IRegiterUserRequestDto = req.body;
            const tokens_id: IJwtUserResponseDto = await authService.registrationService(userData);
            res.cookie('refreshToken', tokens_id.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true });
            return res.json(tokens_id);
        } catch (error) {
            return next(error);
        }
    }

    async login(req: Request<{}, {}, ILoginUserRequestDto>, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const userData: ILoginUserRequestDto = req.body;
            const tokens_id: IJwtUserResponseDto = await authService.login(userData);
            res.cookie('refreshToken', tokens_id.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true });
            return res.json(tokens_id);
        } catch (error) {
            return next(error);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await authService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }
}

export default new AuthController(authService);