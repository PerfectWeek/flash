import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import Room from '../../models/Room';
import { User } from '../../utils/User';
import { generateShortId } from '../../utils/generateShortId';
import { formatRoom } from '../views/RoomView';

export async function createRoom(req: Request, res: Response) {

  const newRoom = new Room({ id: generateShortId(), members: [] });

  const createdRoom = await newRoom.save();

  res.status(201).json({
    message: 'Room created successfully',
    room: formatRoom(createdRoom),
  });
}

export async function getRoom(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const id = req.params.id;

  const room = await Room.findOne({ id });

  if (!room) {
    res.status(404).json({
      message: 'Room not found',
    });
  }

  res.status(200).json({
    message: 'Room found',
    room: formatRoom(room),
  });
}

export async function joinRoom(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const id = req.params.id;
  const user = (<any>req).user_info;

  const room = await Room.findOne({ id });

  const existingMember = room.members.findIndex((m) => {
    return m.email === user.email;
  });
  if (existingMember > -1) {
    room.members.splice(existingMember, 1);
  }

  room.members.push(new User(user.email, [])); // TODO: Fetch timeSlots here
  const joinedRoom = await room.save();

  res.status(200).json({
    message: 'Joined successfully',
    joined_room: joinedRoom,
  });
}
