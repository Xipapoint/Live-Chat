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
        return tokens;
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


    async getUserByNames(firstName: string, lastName: string): Promise<string>{
        const existingUser = await User.findOne({ firstName: firstName, lastName: lastName }).exec();
        if (!existingUser) {
            throw new Error("User doesn't exist");
        }
        return existingUser._id.toString();
    }
}

export default new AuthService(TokenService);
