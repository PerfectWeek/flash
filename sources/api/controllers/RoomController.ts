import { Request, Response } from 'express';
import Room from '../../models/Room';
import { generateShortId } from '../../utils/generateShortId';
import { formatRoom } from '../views/RoomView';
import { validationResult } from 'express-validator';

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
