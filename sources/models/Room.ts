import mongoose from 'mongoose';

import { User } from '../utils/User';

export interface IRoom extends mongoose.Document {
  id: string;
  members: User[];
}

export const roomSchema = new mongoose.Schema({
  id: { type: String, required: true },
  members: { type: Array, required: false },
});

const room = mongoose.model<IRoom>('Room', roomSchema);
export default room;
