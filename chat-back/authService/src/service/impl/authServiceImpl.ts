import { IJwtUserResponseDto } from "../../dto/response/JwtUserResponseDTO.dto";
import { IRegiterUserRequestDto } from '../../dto/request/RegisterUserRequestDTO.dto';
import { ILoginUserRequestDto } from "../../dto/request/LoginUserRequestDTO.dto";

export default interface IAuthServiceImpl{
    registrationService(RegisterData : IRegiterUserRequestDto) : Promise<IJwtUserResponseDto>,
    login(LoginData: ILoginUserRequestDto) : Promise<IJwtUserResponseDto> 
}