import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from 'mongoose';
import { ITokenServiceImpl } from "./impl/tokenService.impl";
import { IJwtUserResponseDto } from "../dto/response/JwtUserResponseDTO.dto";
import Token, { IToken } from "../models/tokenModel";

class tokenService implements ITokenServiceImpl {
    private jwt: typeof jwt;

    constructor() {
        this.jwt = jwt;
    }

    public generateTokens(userId: string): IJwtUserResponseDto {
        const payload = { userId };
        const accessToken = this.jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET as string,
            { expiresIn: '15m' }
        );
        const refreshToken = this.jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET as string,
            { expiresIn: '30d' }
        );

        this.saveToken(userId, refreshToken);

        return {
            accessToken,
            refreshToken
        };
    }

    public async saveToken(userId: string, refreshToken: string): Promise<IToken> {
        const existingToken = await Token.findOne({ userId }).exec();
        if (existingToken) {
            existingToken.refreshToken = refreshToken;
            return existingToken.save();
        } else {
            const newToken = new Token({ userId, refreshToken });
            return newToken.save();
        }
    }

    public async verifyAccessToken(token: string): Promise<JwtPayload | null> {
        try {
            const userData = this.jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as JwtPayload;
            return userData;
        } catch (e) {
            return null;
        }
    }

    public async verifyRefreshToken(token: string): Promise<JwtPayload> {
        return this.jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as JwtPayload;
    }
}

export default new tokenService();
