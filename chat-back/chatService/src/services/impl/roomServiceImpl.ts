import { IChangeRoomNameRequestDTO } from "../../dto/request/ChangeRoomRequestDTO";
import { ICreateRoomRequestDTO } from "../../dto/request/CreateRoomNameRequestDTO";
import { IRoom } from "../../models/roomModel";

export interface IRoomServiceImpl{
    createRoom(roomData: ICreateRoomRequestDTO): Promise<IRoom>;
    changeRoomName(roomData: IChangeRoomNameRequestDTO): Promise<IRoom>
    getAllRooms(userId: string): Promise<IRoom[]>
}