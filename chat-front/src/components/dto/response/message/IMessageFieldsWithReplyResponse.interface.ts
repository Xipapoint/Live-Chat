import { Types } from "mongoose";

export interface IMessageFieldsWithReplyResponse{
    _id: Types.ObjectId,
    replyMessageId?: Types.ObjectId,
    onReplyMessageText?: string,
    roomId: Types.ObjectId, 
    userId: Types.ObjectId,
    message: string;
    timestamp: Date | ' ';
}