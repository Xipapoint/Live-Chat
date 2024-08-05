import {ObjectId, Types} from 'mongoose';

export interface IAllRoomsInterface{
    _id: Types.ObjectId,
    firstName: string,
    lastName: string,
    lastMessageText: string,
    lastMessageTime: string | Date
}