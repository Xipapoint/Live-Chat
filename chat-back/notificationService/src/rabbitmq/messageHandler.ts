// import userService from "../service/userService";
// import { BaseMessage, GetUserRequestMessage, GetNamesRequestMessage } from "./types/request/requestTypes";
// import { ServiceResponse, GetUserResponse, GetNamesResponse } from "./types/response/responseTypes";

// abstract class MessageHandler<T extends BaseMessage, R extends ServiceResponse> {
//   abstract handle(message: T): Promise<R>;
// }
  
// class GetUserHandler extends MessageHandler<GetUserRequestMessage, GetUserResponse> {
//   async handle(message: GetUserRequestMessage): Promise<GetUserResponse> {
//     const userId = await userService.getUserByNames(message.data.firstName, message.data.lastName);
//     return { userId };
//   }
// }
  
// class GetNamesHandler extends MessageHandler<GetNamesRequestMessage, GetNamesResponse> {
//   async handle(message: GetNamesRequestMessage): Promise<GetNamesResponse> {
//     const names = await userService.getNamesById(message.data.id);
//     return { secondFirstName: names.secondFirstName, secondLastName: names.secondLastName };
//   }
// }
  
//   // handlers index
// const handlers: Record<string, MessageHandler<BaseMessage, ServiceResponse>> = {
//   getUser: new GetUserHandler(),
//   getNames: new GetNamesHandler(),
// };
  
//   export default handlers;