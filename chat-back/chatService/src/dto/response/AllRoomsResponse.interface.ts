import { Types} from 'mongoose';

export interface IAllRoomsInterface{
    _id: Types.ObjectId,
    name: string,
    lastMessageText: string,
    lastMessageTime: string | Date
}