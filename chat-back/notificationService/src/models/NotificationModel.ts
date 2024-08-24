import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INotification extends Document {
    userId: Types.ObjectId,
//   senderAvatar: string;
  senderFirstName: string;
  senderLastName: string
  content: string;
  timestamp: Date;
}

const notificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  senderFirstName: { type: String, required: true },
  senderLastName: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Notification = mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;