import mongoose, { Document, Schema, Types } from 'mongoose';
import { IMessage } from './messageModel';

interface IRoom extends Document {
  _id: Types.ObjectId; 
  roomFirstName: string;
  roomLastName: string;
  lastMessage: IMessage;
  users: Array<{ _id: string }>;
  messages: IMessage[]; 
}

const roomSchema = new Schema<IRoom>({
  roomFirstName: { type: String, required: true },
  roomLastName: {type: String, required: true},
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: [{type: Schema.Types.ObjectId, ref: 'User'}],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }], 
});

const Room = mongoose.model<IRoom>('Room', roomSchema);

export default Room;
export { IRoom };
