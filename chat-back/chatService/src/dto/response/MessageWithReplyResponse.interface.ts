import { Types } from "mongoose";
import { IMessage } from "../../models/messageModel";

export interface IMessageWithReplyResponse{
    message: IMessage
    onReplyMessageText: string,
    onReplyMessageFirstName: string
    onReplyMessageLastName: string
}