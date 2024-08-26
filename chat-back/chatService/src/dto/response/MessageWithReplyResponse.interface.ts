import { Types } from "mongoose";
import { IMessage } from "../../models/messageModel";

export interface IMessageWithReplyResponse{
    message: IMessage
    onReplyMessageText: string,
    onReplyMessageFirstName: string
    onReplyMessageLastName: string
    // _id: Types.ObjectId,
    // replyMessage: Types.ObjectId,
    // onReplyMessageText: string,
    // roomId: Types.ObjectId, 
    // userId: Types.ObjectId,
    // message: string;
    // timestamp: Date | ' ';
}