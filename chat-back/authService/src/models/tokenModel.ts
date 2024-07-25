import { Schema, model, Document, Types } from 'mongoose';

interface IToken extends Document {
    _id: Types.ObjectId; // Ensure _id is properly typed
    userId: string;
    refreshToken: string;
}

const tokenSchema = new Schema<IToken>({
    userId: { type: String, required: true },
    refreshToken: { type: String, required: true },
});

const Token = model<IToken>('Token', tokenSchema);

export default Token;
export { IToken };