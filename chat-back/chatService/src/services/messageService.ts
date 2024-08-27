import { Types } from "mongoose";
import Message, { IMessage } from "../models/messageModel"
import { IMessageWithReplyResponse } from "../dto/response/MessageWithReplyResponse.interface";
import { IMessageFieldsWithReplyResponse } from "../dto/response/IMessageFieldsWithReplyResponse.interface";
import { mapMessagesToAllMessagesInterface } from "../helpers/mappers/Mapper";
import Room from "../models/roomModel";

class Messageservice {
    async findMessageById(messageId: Types.ObjectId): Promise<IMessage> {
        try {
            const message = await Message.findById(messageId);
            if (!message) throw new Error("Message doesnt exist")
            return message
        } catch (e) {
            console.error(`Error getting message by its id: ${e}`)
            throw Error
        }
    }

    async getMessagesByRoomId(roomId: string): Promise<IMessageFieldsWithReplyResponse[]> {
        try {
            console.log("сообщения");
            
            const existingRoom = await Room.findById(roomId).populate('messages');
            if (!existingRoom) throw new Error("Room doesn't exist");
            const messages = await mapMessagesToAllMessagesInterface(existingRoom.messages)
            return messages
        } catch (error) {
            console.error(`Error getting messages for room ${roomId}:`, error);
            throw error;
        }
    }

    async replyOnMessage(
        replyMessageId: string,
        roomId: string,
        userId: string,
        content: string,
        onReplyMessageFirstName: string,
        onReplyMessageLastName: string
    ): Promise<IMessageWithReplyResponse> {
        try {
            const onReplyMessage = await Message.findById(replyMessageId)
            if (!onReplyMessage) throw new Error("Message doesnt exist")
            const onReplyText = onReplyMessage.message;
            console.log("id сообщение на которое ответили:", replyMessageId);
            
            const replyingMessage = new Message(
            { 
                roomId: roomId, 
                userId: userId, message: content, 
                replyMessage: new Types.ObjectId(replyMessageId),
                onReplyMessageId: replyMessageId ? new Types.ObjectId(replyMessageId) : undefined,
                onReplyMessageFirstName: onReplyMessageFirstName, 
                onReplyMessageLastName: onReplyMessageLastName 
            })
            await replyingMessage.save()
            
            return { message: replyingMessage, onReplyMessageText: onReplyText, onReplyMessageFirstName, onReplyMessageLastName }
        } catch (error) {
            console.error(`Error replying on message: ${error}`)
            throw Error
        }
    }
}
export default new Messageservice()