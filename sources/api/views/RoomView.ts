import { IRoom } from '../../models/Room';

export function formatRoom(room: IRoom) {
  return {
    id: room.id,
    members: room.members,
  };
}
