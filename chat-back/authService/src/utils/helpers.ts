import tokenService from "../service/tokenService";


export class Helpers{
    public static async getUserIdFromRefreshToken(token: string): Promise<string> {
        try {
            const payload: string = await (tokenService.verifyRefreshToken(token)).then(payload => payload.id);
            return payload
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}
