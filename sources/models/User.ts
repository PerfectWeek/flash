import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  email: string;
  timeSlots: [];
}

export const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  timeSlots: { type: Array, required: false },
});

const user = mongoose.model<IUser>('User', userSchema);
export default user;
