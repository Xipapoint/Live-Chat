import { IChangeRoomNameRequestDTO } from "../../dto/request/ChangeRoomRequestDTO";
import { ICreateRoomRequestDTO } from "../../dto/request/CreateRoomNameRequestDTO";
import { IAllRoomsInterface } from "../../dto/response/AllRoomsResponse.interface";
import { IMessageFieldsWithReplyResponse } from "../../dto/response/IMessageFieldsWithReplyResponse.interface";
import { IMessage } from "../../models/messageModel";
import { IRoom } from "../../models/roomModel";

export interface IRoomServiceImpl{
    createRoom(roomData: ICreateRoomRequestDTO): Promise<IRoom>;
    changeRoomName(roomData: IChangeRoomNameRequestDTO, roomId: string): Promise<IRoom>
    getAllRooms(userId: string): Promise<IAllRoomsInterface[]>
    getRoomInfo(roomId: string): Promise<string>
}