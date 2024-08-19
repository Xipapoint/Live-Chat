import { ILoginUserRequestDto } from '../dto/request/LoginUserRequestDTO.dto';
import { IRegiterUserRequestDto } from '../dto/request/RegisterUserRequestDTO.dto';
import { IJwtUserResponseDto } from '../dto/response/JwtUserResponseDTO.dto';
import User, { IUser } from '../models/userModel'; // Assuming models directory for the User model
import { Security } from '../utils/security';
import IAuthServiceImpl from './impl/authServiceImpl';
import bcrypt from 'bcrypt';
import { ITokenServiceImpl } from './impl/tokenService.impl';
import TokenService from './tokenService';
import { ISecureRegisterResponseDTO } from '../dto/response/SecureRegisterResponseDTO';
import tokenService from './tokenService';
import { GetNamesResponse } from '../rabbitmq/types/response/responseTypes';
import { UnathorizedError } from '../errors/4__Error/UnathorizedError.error';

class AuthService implements IAuthServiceImpl {
    private tokenService: ITokenServiceImpl;

    constructor(tokenService: ITokenServiceImpl) {
        this.tokenService = tokenService;
    }


    // PRIVATE
    private async secureRegisterData(RegisterData: IRegiterUserRequestDto): Promise<ISecureRegisterResponseDTO> {
        const hashedPassword: string = await Security.hash(RegisterData.password)
        return { hashedPassword  };
    }
    

    // PUBLIC
    async registrationService(RegisterData: IRegiterUserRequestDto): Promise<IJwtUserResponseDto> {
        const existingUser = await User.findOne({ firstName: RegisterData.firstName, lastName: RegisterData.lastName }).exec();
        if (existingUser) {
            throw new Error("User already exists");
        }
        const secureData: ISecureRegisterResponseDTO = await this.secureRegisterData(RegisterData);
        const user: IUser = new User({firstName: RegisterData.firstName, lastName: RegisterData.lastName, password: secureData.hashedPassword });
        await user.save();

        const tokens: IJwtUserResponseDto = this.tokenService.generateTokens(user._id.toString(), false);
        await this.tokenService.saveToken(user._id.toString(), tokens.refreshToken);
        return {...tokens};
    }

    async login(LoginData: ILoginUserRequestDto): Promise<IJwtUserResponseDto> {
        const existingUser = await User.findOne({ firstName: LoginData.firstName, lastName: LoginData.lastName }).exec();
        
        if (!existingUser) {
            throw new Error("User doesn't exist");
        }

        const isPassEquals = await bcrypt.compare(LoginData.password, existingUser.password);
        if (!isPassEquals) {
            throw new Error('Incorrect password');
        }
        const tokens: IJwtUserResponseDto = this.tokenService.generateTokens(existingUser._id.toString(), LoginData.rememberMe);
        await this.tokenService.saveToken(existingUser._id.toString(), tokens.refreshToken);
        return tokens;
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw new UnathorizedError("Unathorized");
        }
        console.log("entered refresh service");
        
        const userData = tokenService.verifyRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);

        if (!userData || !tokenFromDb) {
            throw new UnathorizedError("Unathorized");;
        }

        const user = await User.findById((await userData).id);
        if (!user) {
            throw new UnathorizedError("Unathorized");;
        }
        const id = user._id.toString();

        const tokens = tokenService.generateTokens(id);

        await tokenService.saveToken(id, tokens.refreshToken);
        return { ...tokens };
    }
}

export default new AuthService(TokenService);
