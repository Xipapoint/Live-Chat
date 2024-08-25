import mongoose, { Document, Schema, Types } from 'mongoose';

interface IMessage extends Document {
  _id: Types.ObjectId,
  replyMessage: Types.ObjectId,
  roomId: Types.ObjectId, 
  userId: Types.ObjectId,
  message: string;
  timestamp: Date | ' ';
}

const messageSchema = new Schema<IMessage>({
  roomId: { type: Schema.Types.ObjectId, ref: 'Room' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  replyMessage: {type: Schema.Types.ObjectId, ref: 'Message', required: false},
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
export { IMessage };
