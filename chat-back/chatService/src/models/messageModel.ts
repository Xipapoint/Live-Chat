import mongoose, { Document, Schema, Types } from 'mongoose';

interface IMessage extends Document {
  user: Types.ObjectId; 
  message: string;
  timestamp: Date | ' ';
}

const messageSchema = new Schema<IMessage>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
export { IMessage };
