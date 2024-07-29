import { IAllRoomsInterface } from "../../dto/response/AllRooms.interface";
import { IRoom } from "../../models/roomModel";

export const mapRoomToAllRoomsInterface = (rooms: IRoom[]): IAllRoomsInterface[] => {
    return rooms.map(room => ({
        firstName: room.roomFirstName || '',
        lastName: room.roomLastName || '',
        lastMessageText: room.lastMessage?.message || ' ',
        lastMessageTime: room.lastMessage?.timestamp || ' '
    }));
};