import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import Room from '../../models/Room';
import { User } from '../../utils/User';
import { generateShortId } from '../../utils/generateShortId';
import { formatRoom } from '../views/RoomView';
import { fetchEventsTimeSlots } from '../services/GoogleProviderService';
import { TimeSlot } from '../../utils/TimeSlot';
import { getOccupiedSlots } from '../services/SlotFinderService';

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
    return res.status(404).json({
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

  const slots: TimeSlot[][] = await fetchEventsTimeSlots(user.token);
  const slotsFlat = slots.flat(2);

  room.members.push(new User(user.email, slotsFlat)); // TODO: Fetch timeSlots here
  const joinedRoom = await room.save();

  res.status(200).json({
    message: 'Joined successfully',
    joined_room: joinedRoom,
  });
}

export async function mergeSlots(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const id: number = req.params.id;
  const startDate: Date = req.query.start_date;
  const endDate: Date = req.query.end_date;

  const room = await Room.findOne({ id });

  res.status(200).json({
    message: 'Slots found',
    slots: getOccupiedSlots(room.members
      .map(m => m.timeSlots).flat(1),
                            new TimeSlot(startDate, endDate)),
  });
}
