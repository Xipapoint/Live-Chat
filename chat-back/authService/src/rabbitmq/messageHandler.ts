import authService from "../service/authService";
import { BaseMessage, GetUserRequestMessage, GetNamesRequestMessage } from "./types/request/requestTypes";
import { ServiceResponse, GetUserResponse, GetNamesResponse } from "./types/response/responseTypes";

abstract class MessageHandler<T extends BaseMessage, R extends ServiceResponse> {
  abstract handle(message: T): Promise<R>;
}
  
class GetUserHandler extends MessageHandler<GetUserRequestMessage, GetUserResponse> {
  async handle(message: GetUserRequestMessage): Promise<GetUserResponse> {
    const userId = await authService.getUserByNames(message.data.firstName, message.data.lastName);
    return { userId };
  }
}
  
class GetNamesHandler extends MessageHandler<GetNamesRequestMessage, GetNamesResponse> {
  async handle(message: GetNamesRequestMessage): Promise<GetNamesResponse> {
    const names = await authService.getNamesById(message.data.id);
    return { secondFirstName: names.secondFirstName, secondLastName: names.secondLastName };
  }
}
  
  // handlers index
const handlers: Record<string, MessageHandler<BaseMessage, ServiceResponse>> = {
  getUser: new GetUserHandler(),
  getNames: new GetNamesHandler(),
};
  
  export default handlers;