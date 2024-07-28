import { JwtPayload } from "jsonwebtoken";
import { IJwtUserRequestDto } from "../../dto/request/JwtUserRequestDTO.dto";
import { IJwtUserResponseDto } from "../../dto/response/JwtUserResponseDTO.dto";
import {IToken} from "../../models/tokenModel";
import { CustomJwtPayload } from "../interfaces/jwt";

export interface ITokenServiceImpl{
    generateTokens(userId: string, rememberMe: boolean) : IJwtUserResponseDto
    saveToken(userId: string, refreshToken: string): Promise<IToken>
    verifyAccessToken(token: string): Promise<CustomJwtPayload| null>
}