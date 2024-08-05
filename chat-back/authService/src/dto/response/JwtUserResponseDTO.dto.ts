import { Types } from "mongoose";

export class IJwtUserResponseDto {
    accessToken: string;
    refreshToken: string;
    userId: string
}