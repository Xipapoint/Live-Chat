import mongoose, { Document, Schema, Types } from 'mongoose';
interface IUser extends Document {
  _id: Types.ObjectId; 
  firstName: string;
  lastName: string
  password: string;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true, unique: true },
  lastName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

const User = mongoose.model<IUser>('User', userSchema);

export default User
export {IUser}
