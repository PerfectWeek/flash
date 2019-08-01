import { TimeSlot } from '../../utils/TimeSlot';

function overlap(slot: TimeSlot, existingSlot: TimeSlot) {
  return (slot.startTime.getTime() <= existingSlot.endTime.getTime()
    && existingSlot.startTime.getTime() <= slot.endTime.getTime());
}

function mergeSingleSlot(slot: TimeSlot, add: TimeSlot) {
  if (add.startTime < slot.startTime) {
    slot.startTime = add.startTime;
  }
  if (add.endTime > slot.endTime) {
    slot.endTime = add.endTime;
  }
}

function addSlot(mergedSlots: TimeSlot[], slot: TimeSlot) {
  const block = mergedSlots.find(s => overlap(s, slot));

  if (!block) {
    mergedSlots.push(slot);
  } else {
    mergeSingleSlot(block, slot);
  }
}

function mergeSlots(slots: TimeSlot[]): TimeSlot[] {
  const mergedSlots: TimeSlot[] = [];
  slots.forEach(s => addSlot(mergedSlots, s));
  return mergedSlots;
}

export function getOccupiedSlots(
  timeSlots: TimeSlot[],
  timeWindow: TimeSlot): TimeSlot[] {

  const filtered = timeSlots
    .filter(t => overlap(t, timeWindow))
    .sort((a, b) => a.endTime.getTime() - b.endTime.getTime());

  const mergedSlots = mergeSlots(filtered);
  return mergedSlots;
}
