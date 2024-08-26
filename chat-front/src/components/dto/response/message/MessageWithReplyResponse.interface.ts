import { Types } from "mongoose";

export interface IMessageWithReplyResponse{
    _id: Types.ObjectId,
    replyMessage: Types.ObjectId,
    onReplyMessageText: string,
    roomId: Types.ObjectId, 
    userId: Types.ObjectId,
    message: string;
    timestamp: Date | ' ';
}