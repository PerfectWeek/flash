export class TimeSlot {
  startTime: Date;
  endTime: Date;

  public constructor(startTime: Date, endTime: Date) {
    this.startTime = startTime;
    this.endTime = endTime;
  }
}
