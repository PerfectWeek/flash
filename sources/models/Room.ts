import mongoose from 'mongoose';

import { IUser } from './User';

export interface IRoom extends mongoose.Document {
  id: string;
  members: IUser[];
}

export const roomSchema = new mongoose.Schema({
  id: { type: String, required: true },
  members: { type: Array, required: false },
});

const room = mongoose.model<IRoom>('Room', roomSchema);
export default room;
