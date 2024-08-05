import { IAllRoomsInterface } from "../../dto/response/AllRooms.interface";
import { IRoom } from "../../models/roomModel";
import messageService from "../../services/messageService";

export const mapRoomToAllRoomsInterface = async (
    rooms: IRoom[]
  ): Promise<IAllRoomsInterface[]> => {
    const roomPromises = rooms.map(async (room) => {
      const lastMessage = await messageService.findMessageById(room.lastMessage._id);
      return {
        _id: room._id,
        firstName: room.roomFirstName || '',
        lastName: room.roomLastName || '',
        lastMessageText: lastMessage.message,
        lastMessageTime: lastMessage.timestamp,
      };
    });
    return Promise.all(roomPromises);
  };