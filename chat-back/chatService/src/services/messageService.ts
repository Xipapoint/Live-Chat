import { Types } from "mongoose";
import Message, { IMessage } from "../models/messageModel"
import { IMessageWithReplyResponse } from "../dto/response/MessageWithReplyResponse.interface";

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
            const replyingMessage = new Message({ roomId: roomId, userId: userId, message: content, replyMessage: replyMessageId })
            replyingMessage.save()
            return { message: replyingMessage, onReplyMessageText: onReplyText, onReplyMessageFirstName, onReplyMessageLastName }
        } catch (error) {
            console.error(`Error replying on message: ${error}`)
            throw Error
        }
    }
}
export default new Messageservice()