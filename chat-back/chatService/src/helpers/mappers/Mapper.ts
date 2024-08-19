import { IAllRoomsInterface } from "../../dto/response/AllRoomsResponse.interface";
import { IRoom } from "../../models/roomModel";
import messageService from "../../services/messageService";

export const mapRoomToAllRoomsInterface = async (
    rooms: IRoom[],
    secondFirstName: string,
    secondLastName: string,
  ): Promise<IAllRoomsInterface[]> => {
    const roomPromises = rooms.map(async (room) => {
      let lastMessage
      if(room.lastMessage) lastMessage = await messageService.findMessageById(room.lastMessage._id);
      return {
        _id: room._id,
        name: room.roomFirstName === `${secondFirstName + ' ' + secondLastName}` ? room.roomLastName : room.roomFirstName,
        lastMessageText: lastMessage?.message || '',
        lastMessageTime: lastMessage?.timestamp || '',
      };
    });

    return await Promise.all(roomPromises);
  };