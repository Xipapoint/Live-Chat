import { IAllRoomsInterface } from "../../dto/response/AllRoomsResponse.interface";
import { IMessageFieldsWithReplyResponse } from "../../dto/response/IMessageFieldsWithReplyResponse.interface";
import { IMessageWithReplyResponse } from "../../dto/response/MessageWithReplyResponse.interface";
import { IMessage } from "../../models/messageModel";
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

  export const mapMessagesToAllMessagesInterface = async(
    messages: IMessage[]
  ): Promise<IMessageFieldsWithReplyResponse[]> => {
    const messagePromises = messages.map(async (message) => {
      let onReplyText: string | undefined
      if(typeof message.onReplyMessageId !== 'undefined') onReplyText = (await messageService.findMessageById(message.onReplyMessageId)).message
      return{
        _id: message._id,
        replyMessageId: message.onReplyMessageId,
        onReplyMessageText: onReplyText,
        onReplyMessageFirstName: message.onReplyMessageFirstName,
        onReplyMessageLastName: message.onReplyMessageLastName,
        roomId: message.roomId,
        userId: message.userId,
        message: message.message,
        timestamp: message.timestamp
      } as IMessageFieldsWithReplyResponse
    })
    return await Promise.all(messagePromises)
}