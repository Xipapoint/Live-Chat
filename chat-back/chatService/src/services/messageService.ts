import { Types } from "mongoose";
import Message, { IMessage } from "../models/messageModel"

class Messageservice{
    async findMessageById(messageId: Types.ObjectId): Promise<IMessage>{
        try{
            const message = await Message.findById(messageId);
            if(!message) throw new Error("Message doesnt exist")
            return message
        } catch(e){
            console.error(`Error getting message by its id: ${e}`)
            throw Error
        }
    }

    async replyOnMessage(ownMessageId: string, replyMessageId: string): Promise<IMessage>{
        try {
            
        } catch (error) {
            
        }
    }
}
export default new Messageservice()