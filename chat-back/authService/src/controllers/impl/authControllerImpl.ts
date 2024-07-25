import { NextFunction, Request, Response } from "express";
import { IRegiterUserRequestDto } from "../../dto/request/RegisterUserRequestDTO.dto";

export default interface IAuthControllerImpl{
    registration(req: Request<{}, {}, IRegiterUserRequestDto>, res: Response, next: NextFunction): Promise<Response | void>
}