import mongoose from 'mongoose';

import { User } from '../utils/User';

export interface IRoom extends mongoose.Document {
  id: string;
  members: User[];
  expire_at: Date;
}

export const roomSchema = new mongoose.Schema({
  id: { type: String, required: true },
  members: { type: Array, required: false },
  expire_at: { type: Date, default: Date.now, expires: 3600 },
});

const room = mongoose.model<IRoom>('Room', roomSchema);
export default room;
