import { TimeSlot } from "../../utils/TimeSlot";

function overlap(slot: TimeSlot, existingSlot: TimeSlot) {
  return (
    slot.startTime.getTime() <= existingSlot.endTime.getTime() &&
    existingSlot.startTime.getTime() <= slot.endTime.getTime()
  );
}

function mergeBlock(slots: TimeSlot[], add: TimeSlot) {
  if (add.endTime > slots[slots.length - 1].endTime) {
    slots[slots.length - 1].endTime = add.endTime;
  }
}

function addSlot(mergedSlots: TimeSlot[], slot: TimeSlot) {
  const block = mergedSlots.filter(s => overlap(slot, s));

  if (block.length === 0) {
    mergedSlots.push(slot);
  } else {
    mergeBlock(block, slot);
  }
}

function mergeSlots(slots: TimeSlot[]): TimeSlot[] {
  const mergedSlots: TimeSlot[] = [];
  slots.forEach(s => addSlot(mergedSlots, s));
  return mergedSlots;
}

export function getOccupiedSlots(
  timeSlots: TimeSlot[],
  timeWindow: TimeSlot
): TimeSlot[] {
  const filtered = timeSlots
    .filter(t => overlap(t, timeWindow))
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  const mergedSlots = mergeSlots(filtered);
  return mergedSlots;
}
