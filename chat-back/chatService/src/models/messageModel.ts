import mongoose, { Document, Schema, Types } from 'mongoose';

interface IMessage extends Document {
  _id: Types.ObjectId,
  onReplyMessageId?: Types.ObjectId,
  onReplyMessageFirstName?: string,
  onReplyMessageLastName?: string,
  roomId: Types.ObjectId, 
  userId: Types.ObjectId,
  message: string;
  timestamp: Date | ' ';
}

const messageSchema = new Schema<IMessage>({
  roomId: { type: Schema.Types.ObjectId, ref: 'Room' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  onReplyMessageId: {type: Schema.Types.ObjectId, ref: 'Message', required: false},
  onReplyMessageFirstName: { type: String, required: false },
  onReplyMessageLastName: { type: String, required: false },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
export { IMessage };
